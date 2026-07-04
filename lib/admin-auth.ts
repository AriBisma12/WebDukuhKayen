import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const ADMIN_SESSION_COOKIE = "padukuhan_admin_session";
const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

export type AdminSessionUser = {
  id: string;
  username: string;
  displayName: string;
};

type AdminCredentialRow = {
  id: string;
  username: string;
  display_name: string;
  is_active: boolean;
};

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function verifyAdminCredentials(
  username: string,
  password: string,
): Promise<AdminSessionUser | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.rpc("verify_admin_credentials", {
    login_username: username,
    login_password: password,
  });

  if (error) {
    throw new Error(`Failed to verify admin credentials: ${error.message}`);
  }

  const row = (data as AdminCredentialRow[] | null)?.[0];
  if (!row || !row.is_active) {
    return null;
  }

  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
  };
}

export async function hashAdminPassword(password: string) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.rpc("hash_admin_password", {
    raw_password: password,
  });

  if (error || typeof data !== "string") {
    throw new Error(`Failed to hash admin password: ${error?.message ?? "Unknown error"}`);
  }

  return data;
}

export async function createAdminSession(adminUserId: string) {
  const supabase = createSupabaseAdminClient();
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + ADMIN_SESSION_TTL_SECONDS * 1000);

  const { error } = await supabase.from("admin_sessions").insert({
    admin_user_id: adminUserId,
    token_hash: hashToken(token),
    expires_at: expiresAt.toISOString(),
  });

  if (error) {
    throw new Error(`Failed to create admin session: ${error.message}`);
  }

  const cookieStore = await cookies();
  cookieStore.set({
    name: ADMIN_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_TTL_SECONDS,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (sessionToken) {
    const supabase = createSupabaseAdminClient();
    await supabase
      .from("admin_sessions")
      .delete()
      .eq("token_hash", hashToken(sessionToken));
  }

  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export async function getCurrentAdminUser(): Promise<AdminSessionUser | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!sessionToken) {
    return null;
  }

  const supabase = createSupabaseAdminClient();
  const nowIso = new Date().toISOString();
  const { data: session, error: sessionError } = await supabase
    .from("admin_sessions")
    .select("admin_user_id")
    .eq("token_hash", hashToken(sessionToken))
    .gt("expires_at", nowIso)
    .maybeSingle();

  if (sessionError) {
    throw new Error(`Failed to load admin session: ${sessionError.message}`);
  }

  if (!session) {
    return null;
  }

  const { data: user, error: userError } = await supabase
    .from("admin_users")
    .select("id, username, display_name, is_active")
    .eq("id", session.admin_user_id)
    .eq("is_active", true)
    .maybeSingle();

  if (userError) {
    throw new Error(`Failed to load admin user: ${userError.message}`);
  }

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    displayName: user.display_name,
  };
}

export async function requireAdminUser() {
  const adminUser = await getCurrentAdminUser();

  if (!adminUser) {
    redirect("/admin/login");
  }

  return adminUser;
}

export async function redirectIfAdminAuthenticated() {
  const adminUser = await getCurrentAdminUser();

  if (adminUser) {
    redirect("/admin");
  }
}

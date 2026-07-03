import { cache } from "react";
import {
  documentationCategories as fallbackDocumentationCategories,
  documentationHighlights as fallbackDocumentationHighlights,
  documentationVideos as fallbackDocumentationVideos,
  featuredServices as fallbackFeaturedServices,
  navigation as fallbackNavigation,
  profileOfficials as fallbackProfileOfficials,
  profileStats as fallbackProfileStats,
  villageBoundaries as fallbackVillageBoundaries,
  villageNews as fallbackVillageNews,
  villageStats as fallbackVillageStats,
  type DocumentationPost,
  type DocumentationVideo,
  type FeaturedService,
  type NavigationLink,
  type NewsItem,
  type ProfileOfficial,
  type VillageBoundary,
  type VillageStat,
} from "@/app/_data/site";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function formatIndonesianDate(value: string | null) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export const getNavigationLinks = cache(async (): Promise<NavigationLink[]> => {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return fallbackNavigation;
  }

  const { data, error } = await supabase
    .from("navigation_links")
    .select("label, href")
    .order("sort_order", { ascending: true });

  if (error || !data?.length) {
    return fallbackNavigation;
  }

  return data;
});

export const getFeaturedServices = cache(async (): Promise<FeaturedService[]> => {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return fallbackFeaturedServices;
  }

  const { data, error } = await supabase
    .from("featured_services")
    .select("title, icon, href")
    .order("sort_order", { ascending: true });

  if (error || !data?.length) {
    return fallbackFeaturedServices;
  }

  return data;
});

export const getVillageNews = cache(async (): Promise<NewsItem[]> => {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return fallbackVillageNews;
  }

  const { data, error } = await supabase
    .from("village_news")
    .select("category, title, excerpt, image_url, published_at")
    .order("sort_order", { ascending: true });

  if (error || !data?.length) {
    return fallbackVillageNews;
  }

  return data.map((item) => ({
    category: item.category,
    date: formatIndonesianDate(item.published_at),
    title: item.title,
    excerpt: item.excerpt,
    image: item.image_url ?? "",
  }));
});

export const getVillageStats = cache(async (): Promise<VillageStat[]> => {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return fallbackVillageStats;
  }

  const { data, error } = await supabase
    .from("village_stats")
    .select("label, value")
    .order("sort_order", { ascending: true });

  if (error || !data?.length) {
    return fallbackVillageStats;
  }

  return data;
});

type DocumentationPostRow = {
  title: string;
  excerpt: string;
  image_url: string | null;
  published_at: string | null;
  is_featured: boolean;
  category: { name: string } | null;
};

export const getDocumentationCategories = cache(async (): Promise<string[]> => {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return fallbackDocumentationCategories;
  }

  const { data, error } = await supabase
    .from("documentation_categories")
    .select("name")
    .order("sort_order", { ascending: true });

  if (error || !data?.length) {
    return fallbackDocumentationCategories;
  }

  const categories = data.map((item) => item.name);
  return categories.includes("Semua") ? categories : ["Semua", ...categories];
});

export const getDocumentationPosts = cache(
  async (): Promise<DocumentationPost[]> => {
    const supabase = createSupabaseServerClient();
    if (!supabase) {
      return fallbackDocumentationHighlights;
    }

    const { data, error } = await supabase
      .from("documentation_posts")
      .select(
        "title, excerpt, image_url, published_at, is_featured, category:documentation_categories(name)",
      )
      .order("sort_order", { ascending: true })
      .returns<DocumentationPostRow[]>();

    if (error || !data?.length) {
      return fallbackDocumentationHighlights;
    }

    return data.map((item) => ({
      category: item.category?.name ?? "Umum",
      date: formatIndonesianDate(item.published_at),
      title: item.title,
      excerpt: item.excerpt,
      image: item.image_url ?? "",
      featured: item.is_featured,
    }));
  },
);

export const getDocumentationVideos = cache(
  async (): Promise<DocumentationVideo[]> => {
    const supabase = createSupabaseServerClient();
    if (!supabase) {
      return fallbackDocumentationVideos;
    }

    const { data, error } = await supabase
      .from("documentation_videos")
      .select("title, duration, image_url")
      .order("sort_order", { ascending: true });

    if (error || !data?.length) {
      return fallbackDocumentationVideos;
    }

    return data.map((item) => ({
      title: item.title,
      duration: item.duration ?? "",
      image: item.image_url ?? "",
    }));
  },
);

export const getProfileStats = cache(async (): Promise<VillageStat[]> => {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return fallbackProfileStats;
  }

  const { data, error } = await supabase
    .from("profile_stats")
    .select("label, value")
    .order("sort_order", { ascending: true });

  if (error || !data?.length) {
    return fallbackProfileStats;
  }

  return data;
});

export const getProfileOfficials = cache(async (): Promise<ProfileOfficial[]> => {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return fallbackProfileOfficials;
  }

  const { data, error } = await supabase
    .from("profile_officials")
    .select("name, role")
    .order("sort_order", { ascending: true });

  if (error || !data?.length) {
    return fallbackProfileOfficials;
  }

  return data;
});

export const getVillageBoundaries = cache(
  async (): Promise<VillageBoundary[]> => {
    const supabase = createSupabaseServerClient();
    if (!supabase) {
      return fallbackVillageBoundaries;
    }

    const { data, error } = await supabase
      .from("village_boundaries")
      .select("direction, description")
      .order("sort_order", { ascending: true });

    if (error || !data?.length) {
      return fallbackVillageBoundaries;
    }

    return data;
  },
);

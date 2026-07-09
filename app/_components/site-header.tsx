import { getNavigationLinks } from "@/lib/site-content";
import { SiteHeaderShell } from "./site-header-shell";

type SiteHeaderProps = {
  currentPath?: string;
};

export async function SiteHeader({ currentPath = "/" }: SiteHeaderProps) {
  const navigation = await getNavigationLinks();

  return <SiteHeaderShell navigation={navigation} currentPath={currentPath} />;
}

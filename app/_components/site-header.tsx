import { useEffect, useState } from "react";
import { getNavigationLinks } from "@/lib/site-content";
import { navigation as fallbackNavigation, type NavigationLink } from "@/app/_data/site";
import { SiteHeaderShell } from "./site-header-shell";

type SiteHeaderProps = {
  currentPath?: string;
};

export function SiteHeader({ currentPath = "/" }: SiteHeaderProps) {
  const [navigation, setNavigation] = useState<NavigationLink[]>(fallbackNavigation);

  useEffect(() => {
    let mounted = true;
    void getNavigationLinks().then((items) => {
      if (mounted) {
        setNavigation(items);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return <SiteHeaderShell navigation={navigation} currentPath={currentPath} />;
}

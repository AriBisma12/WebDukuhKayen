"use client";

import {
  useEffect,
  useMemo,
  useState,
  type AnchorHTMLAttributes,
  type ReactNode,
} from "react";

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  children: ReactNode;
};

function notifyRouteChange() {
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function scrollAfterNavigation(href: string) {
  const url = new URL(href, window.location.href);

  if (!url.hash) {
    window.scrollTo({ top: 0, behavior: "auto" });
    return;
  }

  window.setTimeout(() => {
    const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    target?.scrollIntoView({ block: "start" });
  }, 0);
}

function navigateTo(href: string, mode: "push" | "replace" = "push") {
  if (mode === "replace") {
    window.history.replaceState(null, "", href);
  } else {
    window.history.pushState(null, "", href);
  }

  notifyRouteChange();
  scrollAfterNavigation(href);
}

export function Link({ href, onClick, target, children, ...props }: LinkProps) {
  return (
    <a
      {...props}
      href={href}
      target={target}
      onClick={(event) => {
        onClick?.(event);
        if (
          event.defaultPrevented ||
          target ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          new URL(href, window.location.href).origin !== window.location.origin ||
          href.startsWith("mailto:") ||
          href.startsWith("tel:") ||
          href.startsWith("#")
        ) {
          return;
        }

        event.preventDefault();
        navigateTo(href);
      }}
    >
      {children}
    </a>
  );
}

function useLocationValue() {
  const [value, setValue] = useState(() => window.location.href);

  useEffect(() => {
    function handleChange() {
      setValue(window.location.href);
    }

    window.addEventListener("popstate", handleChange);
    return () => window.removeEventListener("popstate", handleChange);
  }, []);

  return value;
}

export function usePathname() {
  useLocationValue();
  return window.location.pathname;
}

export function useSearchParams() {
  const locationValue = useLocationValue();
  return useMemo(() => new URL(locationValue).searchParams, [locationValue]);
}

export function useRouter() {
  return useMemo(
    () => ({
      push: (href: string) => navigateTo(href, "push"),
      replace: (href: string) => navigateTo(href, "replace"),
    }),
    [],
  );
}

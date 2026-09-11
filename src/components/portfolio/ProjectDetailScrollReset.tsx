"use client";

import { useLayoutEffect } from "react";

type ProjectDetailScrollResetProps = {
  routeKey: string;
};

export function ProjectDetailScrollReset({
  routeKey,
}: ProjectDetailScrollResetProps) {
  useLayoutEffect(() => {
    const scrollToAbsoluteTop = () => {
      const root = document.documentElement;
      const previousScrollBehavior =
        root.style.scrollBehavior;

      root.style.scrollBehavior = "auto";

      window.scrollTo(0, 0);

      const scrollingElement =
        document.scrollingElement;

      if (scrollingElement) {
        scrollingElement.scrollTop = 0;
        scrollingElement.scrollLeft = 0;
      }

      root.style.scrollBehavior =
        previousScrollBehavior;
    };

    // Next.js scroll management can run around the route commit.
    // The Portfolio card disables Next's automatic scroll restoration,
    // and these passes guarantee that the new detail route starts at 0.
    scrollToAbsoluteTop();

    const firstFrame =
      window.requestAnimationFrame(() => {
        scrollToAbsoluteTop();

        window.requestAnimationFrame(() => {
          scrollToAbsoluteTop();
        });
      });

    return () => {
      window.cancelAnimationFrame(firstFrame);
    };
  }, [routeKey]);

  return null;
}

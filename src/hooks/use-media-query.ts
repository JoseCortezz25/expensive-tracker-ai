/**
 * useMediaQuery Hook
 *
 * Custom hook for responsive design using media queries.
 * Returns true if the media query matches.
 *
 * @module hooks/use-media-query
 */

'use client';

import * as React from 'react';

/**
 * Hook for detecting media query matches
 *
 * @param query - Media query string (e.g., "(min-width: 768px)")
 * @returns true if the media query matches, false otherwise
 *
 * @example
 * ```tsx
 * const isDesktop = useMediaQuery('(min-width: 768px)');
 * const isMobile = useMediaQuery('(max-width: 767px)');
 * const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
 * ```
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia(query);

    // Set initial value
    setMatches(media.matches);

    // Create event listener
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add listener (modern browsers)
    if (media.addEventListener) {
      media.addEventListener('change', listener);
    } else {
      // Fallback for older browsers
      media.addListener(listener);
    }

    // Cleanup
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', listener);
      } else {
        // Fallback for older browsers
        media.removeListener(listener);
      }
    };
  }, [query]);

  return matches;
}

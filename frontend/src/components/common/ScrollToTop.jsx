import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component
 * Ensures that whenever a user navigates between routes,
 * the window is automatically scrolled to the very top (y = 0).
 */
export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Instantly scroll window to top on route change
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

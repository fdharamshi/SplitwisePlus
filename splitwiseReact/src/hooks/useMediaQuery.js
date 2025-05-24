import { useState, useEffect } from 'react';

/**
 * Custom hook that returns whether the current viewport matches the provided media query
 * @param {string} query - CSS media query string (e.g. '(max-width: 768px)')
 * @returns {boolean} - True if the media query matches
 */
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);
    
    // Create listener function
    const handler = (event) => setMatches(event.matches);
    
    // Add listener
    mediaQuery.addEventListener('change', handler);
    
    // Clean up
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
};

export default useMediaQuery;

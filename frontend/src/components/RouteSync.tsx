import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * RouteSync component synchronizes the current route with the parent window.
 * This allows the parent to track navigation within the iframe and update
 * its address bar accordingly.
 */
export function RouteSync() {
  const location = useLocation();

  useEffect(() => {
    const messageData = {
      type: 'VIE_ROUTE_CHANGE',
      payload: {
        path: location.pathname + location.search + location.hash,
      }
    };

    // Post to parent window if we're in an iframe
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(messageData, '*');
    } else if (window.top && window.top !== window) {
      window.top.postMessage(messageData, '*');
    }
  }, [location]);

  // This component doesn't render anything
  return null;
}

import { useEffect } from 'react';
import { useTheme } from '@/lib/providers/ThemeProvider';

/**
 * ThemeSync component listens for theme changes from the parent window (VIE app)
 * and synchronizes the sandbox theme accordingly.
 *
 * This creates a one-way sync: parent theme changes propagate to sandbox,
 * but sandbox theme changes remain local and don't affect the parent.
 */
export function ThemeSync() {
  const { setTheme } = useTheme();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only process VIE_THEME_CHANGE messages
      if (event.data?.type !== 'VIE_THEME_CHANGE') {
        return;
      }

      // Validate the theme value
      const theme = event.data.payload?.theme;
      if (theme === 'dark' || theme === 'light' || theme === 'system') {
        setTheme(theme);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [setTheme]);

  // This component doesn't render anything
  return null;
}

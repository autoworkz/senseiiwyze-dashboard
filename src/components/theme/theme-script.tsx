// This script runs before React hydration to prevent theme flash
export function ThemeScript() {
  const script = `
    (function() {
      try {
        const theme = document.cookie
          .split('; ')
          .find(row => row.startsWith('theme='))
          ?.split('=')[1] || 'system';
        
        const root = document.documentElement;
        
        if (theme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          root.classList.add(systemTheme);
        } else {
          root.classList.add(theme);
        }
      } catch (e) {
        // Fallback to light theme if anything fails
        document.documentElement.classList.add('light');
      }
    })();
  `

  return (
    <script
      dangerouslySetInnerHTML={{ __html: script }}
      suppressHydrationWarning
    />
  )
}
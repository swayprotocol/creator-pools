import { Dispatch, SetStateAction, useEffect, useState } from 'react';

const initialTheme = typeof window !== 'undefined' ? localStorage.theme || 'light' : 'light';

function useDarkMode(): [string, Dispatch<SetStateAction<string>>] {
  const [theme, setTheme] = useState(initialTheme);
  const colorTheme = theme === 'dark' ? 'light' : 'dark';

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(colorTheme);
    root.classList.add(theme);

    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  return [colorTheme, setTheme];
}

export default useDarkMode;

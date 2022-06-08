import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useConfig } from '../contexts/Config';
import { setGlobalStyles } from './setGlobalStyles';

const initialTheme = typeof window !== 'undefined' ? localStorage.themeStyle || 'main' : 'main';

function useDarkMode(): [string, Dispatch<SetStateAction<string>>] {
  const [themeStyle, setThemeStyle] = useState(initialTheme);
  const colorTheme = themeStyle === 'alt' ? 'main' : 'alt';
  const { theme } = useConfig();

  useEffect(() => {
    if (theme) {
      setGlobalStyles(theme.hasAltTheme ? theme[themeStyle] : theme['main']);

      if (typeof window !== 'undefined') {
        localStorage.setItem('themeStyle', themeStyle);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeStyle, theme]);

  return [colorTheme, setThemeStyle];
}

export default useDarkMode;
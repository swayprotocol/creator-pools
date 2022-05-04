export function setGlobalStyles(themeStyle: any): void {
  for (const property in themeStyle) {
    document.documentElement.style.setProperty(property, themeStyle[property]);
  }
}

export const getSocialType = (poolHandle: string): string => {
  // e.g. ig
  return poolHandle.split('-')[0];
}

export const setSocialPrefix = (poolHandle: string, socialType: string): string => {
  // e.g. ig-cloutdotart
  return `${socialType}-${poolHandle}`;
}

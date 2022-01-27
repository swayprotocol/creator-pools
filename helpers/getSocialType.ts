import { StakedEventSocialType } from '../shared/interfaces';

export const getSocialType = (poolHandle: string): StakedEventSocialType => {
  const socialString = poolHandle.split('-')[0];

  switch(socialString) {
    case 'ig':
      return StakedEventSocialType.IG;
    case 'tt':
      return StakedEventSocialType.TT;
    case 'ens':
      return StakedEventSocialType.ENS;
    case 'w':
      return StakedEventSocialType.W;
  }
}

export const setSocialPrefix = (poolHandle: string, socialType: StakedEventSocialType): string => {
  let socialString;

  switch(socialType) {
    case StakedEventSocialType.IG:
      socialString = 'ig';
      break;
    case StakedEventSocialType.TT:
      socialString = 'tt';
      break;
    case StakedEventSocialType.ENS:
      socialString = 'ens';
      break;
    case StakedEventSocialType.W:
      socialString = 'w';
      break;
  }

  // e.g. ig-cloutdotart
  return `${socialString}-${poolHandle}`;
}

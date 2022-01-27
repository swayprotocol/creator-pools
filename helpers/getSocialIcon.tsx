import React from 'react';
import { StakedEventSocialType } from '../shared/interfaces';

export const getSocialIcon = (social: StakedEventSocialType) => {
  if (social === StakedEventSocialType.TT) {
    return (
      <svg width="22" height="22" viewBox="0 0 256 256" stroke="none" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M224,76a48.05436,48.05436,0,0,1-48-48,7.99977,7.99977,0,0,0-8-8H128a7.99977,7.99977,0,0,0-8,8V156a20,20,0,1,1-28.56738-18.0791,7.99971,7.99971,0,0,0,4.56689-7.22607L96,89.05569a7.99952,7.99952,0,0,0-9.40234-7.876A76.00518,76.00518,0,1,0,176,156l-.00049-35.70752A103.32406,103.32406,0,0,0,224,132a7.99977,7.99977,0,0,0,8-8V84A7.99977,7.99977,0,0,0,224,76Zm-8,39.64356a87.21519,87.21519,0,0,1-43.32861-16.15479,7.99982,7.99982,0,0,0-12.67188,6.49414L160,156a60,60,0,1,1-80-56.6001l-.00049,26.66846A35.99955,35.99955,0,1,0,136,156V36h24.49756A64.13944,64.13944,0,0,0,216,91.50246Z"/>
      </svg>
    )
  } else if (social === StakedEventSocialType.IG) {
    return (
      <svg fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
        <rect height="20" rx="5" ry="5" width="20" x="2" y="2"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" x2="17.5" y1="6.5" y2="6.5"/>
      </svg>
    )
  } else if (social === StakedEventSocialType.ENS) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72.52 80.95" width="22" height="18" fill="currentColor">
        <path d="M15.43 20.74a9.75 9.75 0 0 1 3.18-3.5l22.34-15.6-22.89 37.85s-2-3.38-2.78-5.09a16.19 16.19 0 0 1 .15-13.66zM6.21 46.85a25.47 25.47 0 0 0 10 18.51l24.71 17.23s-15.46-22.28-28.5-44.45a22.39 22.39 0 0 1-2.62-7.56 12.1 12.1 0 0 1 0-3.63c-.34.63-1 1.92-1 1.92a29.35 29.35 0 0 0-2.67 8.55 52.28 52.28 0 0 0 .08 9.43zm63 3c-.8-1.71-2.78-5.09-2.78-5.09L43.58 82.59 65.92 67a9.75 9.75 0 0 0 3.18-3.5 16.19 16.19 0 0 0 .15-13.66zm9.07-12.46a25.47 25.47 0 0 0-10-18.51L43.61 1.64s15.45 22.28 28.5 44.45a22.39 22.39 0 0 1 2.61 7.56 12.1 12.1 0 0 1 0 3.63c.34-.63 1-1.92 1-1.92a29.35 29.35 0 0 0 2.67-8.55 52.28 52.28 0 0 0-.07-9.43z" transform="translate(-6 -1.64)"/>
      </svg>
    )
  } else if (social === StakedEventSocialType.W) {
    return (
      <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="22" height="22">
        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2.7" d="M12 24L26 2 40 24 26 32zM26 32L26 2"/>
        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2.7" d="M12 29L26 37 40 29 26 48zM26 48L26 37M12 24L26 18 40 24"/>
      </svg>
    )
  }
}

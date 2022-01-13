import React from 'react';
import { StakedEventSocialType } from '../shared/interfaces';

export const getSocialIcon = (social: StakedEventSocialType) => {
  if (social === StakedEventSocialType.TT) {
    return (
      <svg width="22" height="22" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg">
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
  }
}
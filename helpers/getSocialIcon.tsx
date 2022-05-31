import React from 'react';

export const getSocialIcon = (social: string) => {
    return (
      <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="22" height="22">
        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2.7" d="M12 24L26 2 40 24 26 32zM26 32L26 2"/>
        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2.7" d="M12 29L26 37 40 29 26 48zM26 48L26 37M12 24L26 18 40 24"/>
      </svg>
    )
}

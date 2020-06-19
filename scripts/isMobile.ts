const mobileHeight = 812; // iphone X, very long phone
const mobileWidth = 768; // Tablet size, by Chrome

/**
 * This function returns if we should consider the client a mobile device, e.g. smartphone, or not.
 * @param window The window of the current webpage. We will use its dimensions.
 */
export function isMobile(): boolean {
  // if its not wide enough we need to change no matter the height
  return window.innerWidth <= mobileWidth
    // if its not high we only change if its not wide as well
    || (window.innerWidth <= mobileWidth && window.innerHeight <= mobileHeight);
}

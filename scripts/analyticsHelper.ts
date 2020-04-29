function hashString(inputString: string): number {
  let hash = 0;
  if (inputString.length === 0) return hash;
  for (let i = 0; i < inputString.length; i++) {
    //eslint-disable-line
    const char = inputString.charCodeAt(i);
    hash = (hash << 5) - hash + char; //eslint-disable-line
    // Convert to 32bit integer
    hash &= hash; //eslint-disable-line
  }
  return hash;
}

export function addHashedUserIdToWindow(window, userID:flintId) {
  // eslint-disable-next-line no-param-reassign
  window.flint_user_id_hashed = hashString(userID as string);
}

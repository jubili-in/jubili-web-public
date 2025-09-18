/**
 * Extract query parameters from URL
 */
export const getUrlParams = (url?: string): URLSearchParams => {
  if (typeof window !== 'undefined') {
    const currentUrl = url || window.location.href;
    const urlObj = new URL(currentUrl);
    return urlObj.searchParams;
  }
  return new URLSearchParams();
};

/**
 * Extract a specific parameter from URL
 */
export const getUrlParam = (paramName: string, url?: string): string | null => {
  const params = getUrlParams(url);
  return params.get(paramName);
};

/**
 * Remove specific parameters from URL without page reload
 */
export const removeUrlParams = (paramsToRemove: string[]): void => {
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href);
    paramsToRemove.forEach(param => {
      url.searchParams.delete(param);
    });
    
    // Update URL without page reload
    window.history.replaceState({}, '', url.toString());
  }
};

/**
 * Check if current page is accessed via redirect (has specific params)
 */
export const isRedirectedFrom = (paramName: string): boolean => {
  return getUrlParam(paramName) !== null;
};

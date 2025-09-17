import Cookies from 'js-cookie';

// Default cookie options for security
const DEFAULT_OPTIONS = {
  // Use secure cookies in production
  secure: process.env.NODE_ENV === 'production',
  // Prevent access through JavaScript
  httpOnly: false, // Note: Can't set true in client-side code, would require server-side implementation
  // Prevent CSRF attacks
  sameSite: 'strict',
  // Set expiration (default: 7 days)
  expires: 7
};

// Cookie prefix for the app
const COOKIE_PREFIX = 'validate_it_';

/**
 * Secure storage utility for handling data with cookies as the primary method
 * Falls back to memory storage when cookies are disabled
 */
class SecureStorage {
  constructor() {
    // In-memory fallback when cookies are disabled
    this.memoryStorage = {};
    this.cookiesEnabled = this.checkCookiesEnabled();
  }

  /**
   * Check if cookies are enabled in the browser
   */
  checkCookiesEnabled() {
    try {
      // Try to set a test cookie
      Cookies.set('test_cookie', 'test', { expires: 1 });
      const result = Cookies.get('test_cookie') === 'test';
      Cookies.remove('test_cookie');
      return result;
    } catch (e) {
      return false;
    }
  }

  /**
   * Set an item in secure storage
   * @param {string} key - The key to store the data under
   * @param {any} value - The data to store
   * @param {object} options - Cookie options
   */
  setItem(key, value, options = {}) {
    const cookieKey = COOKIE_PREFIX + key;
    const serializedValue = typeof value !== 'string' ? JSON.stringify(value) : value;
    
    if (this.cookiesEnabled) {
      Cookies.set(cookieKey, serializedValue, { ...DEFAULT_OPTIONS, ...options });
    } else {
      // Fall back to memory storage
      this.memoryStorage[cookieKey] = serializedValue;
    }
  }

  /**
   * Get an item from secure storage
   * @param {string} key - The key of the data to retrieve
   * @returns {any} The stored data
   */
  getItem(key) {
    const cookieKey = COOKIE_PREFIX + key;
    
    if (this.cookiesEnabled) {
      const value = Cookies.get(cookieKey);
      if (!value) return null;
      
      // Try to parse JSON, return raw value if parsing fails
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    } else {
      // Fall back to memory storage
      return this.memoryStorage[cookieKey] || null;
    }
  }

  /**
   * Remove an item from secure storage
   * @param {string} key - The key of the data to remove
   */
  removeItem(key) {
    const cookieKey = COOKIE_PREFIX + key;
    
    if (this.cookiesEnabled) {
      Cookies.remove(cookieKey, { 
        path: '/',
        secure: DEFAULT_OPTIONS.secure,
        sameSite: DEFAULT_OPTIONS.sameSite
      });
    } else {
      // Fall back to memory storage
      delete this.memoryStorage[cookieKey];
    }
  }

  /**
   * Clear all items in secure storage with our prefix
   */
  clear() {
    if (this.cookiesEnabled) {
      // Find and remove all cookies with our prefix
      const allCookies = Cookies.get();
      Object.keys(allCookies).forEach(key => {
        if (key.startsWith(COOKIE_PREFIX)) {
          this.removeItem(key.substring(COOKIE_PREFIX.length));
        }
      });
    } else {
      // Clear memory storage
      this.memoryStorage = {};
    }
  }
}

// Export a singleton instance
export default new SecureStorage();
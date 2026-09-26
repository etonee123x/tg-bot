/** @typedef {import('#src/api/openapi.ts').operations['createOneTimeToken']} CreateOneTimeTokenOperation */
/** @typedef {CreateOneTimeTokenOperation['responses'][200]['content']['application/json']} CreateOneTimeTokenResponse */

export class AuthLinkService {
  #apiBaseUrl;
  #oneTimeTokenSecret;
  #authPattern;

  /**
   * @param {string} apiBaseUrl
   * @param {string} oneTimeTokenSecret
   * @param {string} authPattern
   */
  constructor(apiBaseUrl, oneTimeTokenSecret, authPattern) {
    if (!authPattern.includes('{token}')) {
      throw new TypeError('AUTH_PATTERN must contain the {token} placeholder.');
    }

    this.#apiBaseUrl = new URL(apiBaseUrl);
    this.#oneTimeTokenSecret = oneTimeTokenSecret;
    this.#authPattern = authPattern;
  }

  async #requestToken() {
    const response = await fetch(new URL('/one-time-token', this.#apiBaseUrl), {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'x-secret': this.#oneTimeTokenSecret,
      },
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      throw new Error(`Authentication API returned HTTP ${response.status}.`);
    }

    /** @type {CreateOneTimeTokenResponse} */
    const result = await response.json();
    if (typeof result?.token !== 'string') {
      throw new TypeError('Authentication API response must contain a one-time token.');
    }

    return result.token;
  }

  /**
   * Requests a one-time token and inserts it into the configured URL pattern.
   * @returns {Promise<string>}
   */
  async createLink() {
    const token = await this.#requestToken();

    return this.#authPattern.replaceAll('{token}', () => encodeURIComponent(token));
  }
}

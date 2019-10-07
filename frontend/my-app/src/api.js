/* Information about contacting the backend of stocks website */
const API_URL='http://localhost:8000'
/**
 * Make a fetch request to the backend.
 * @param {string} url - url relative to the root of the backend URL.
 * @param {object} options - fetch options to forward to fetchBackend
 */
export async function fetchBackend(url, options) {
    return fetch(`${API_URL}${url}`, options);
}

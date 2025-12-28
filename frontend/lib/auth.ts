/**
 * Auth utilities for making authenticated API requests.
 */

/**
 * Fetch wrapper that automatically adds authentication headers.
 */
export async function fetchWithAuth(
    endpoint: string,
    options: RequestInit = {}
): Promise<Response> {
    const token = localStorage.getItem("access_token");
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const apiBase = `${protocol}//${hostname}:8000`;

    const headers = {
        ...options.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
    };

    const url = endpoint.startsWith("http") ? endpoint : `${apiBase}${endpoint}`;

    return fetch(url, {
        ...options,
        headers,
    });
}

/**
 * Check if the user is authenticated.
 */
export function isAuthenticated(): boolean {
    return !!localStorage.getItem("access_token");
}

/**
 * Clear authentication tokens (logout).
 */
export function clearAuth(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
}

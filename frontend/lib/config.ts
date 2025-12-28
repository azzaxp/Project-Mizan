export const getApiBaseUrl = () => {
    if (typeof window === 'undefined') return ''; // Server-side

    const protocol = window.location.protocol;
    const hostname = window.location.hostname;

    // If we have an environment variable, use it (Production build time)
    if (process.env.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL;
    }

    // If localhost, use port 8000
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return `${protocol}//${hostname}:8000`;
    }

    // For production (e.g., digitaljamath.com), the API is on the same domain/port via Nginx /api/
    // But our frontend code expects the ROOT URL (e.g. https://digitaljamath.com)
    // and appends /api/ endpoint. 
    // Since Nginx proxies /api/ to backend, we can just use the current origin.
    return window.location.origin;
};

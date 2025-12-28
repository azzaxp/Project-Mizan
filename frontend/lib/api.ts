import { getApiBaseUrl } from "@/lib/config";

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
    // 1. Construct Full URL if relative
    let fullUrl = url;
    const apiBase = getApiBaseUrl();

    if (url.startsWith('/')) {
        fullUrl = `${apiBase}${url}`;
    } else if (!url.startsWith('http')) {
        // Assume it's a relative path meant for API
        fullUrl = `${apiBase}${url}`;
    }

    // 2. Attach Token
    let token = localStorage.getItem("access_token");
    const headers = new Headers(options.headers || {});

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    // Ensure JSON content type if body is present and not FormData
    if (options.body && typeof options.body === 'string' && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    const config = {
        ...options,
        headers
    };

    let response = await fetch(fullUrl, config);

    // 3. Handle 401 (Token Expired)
    if (response.status === 401) {
        // Prevent infinite loops if the failed request was already a refresh attempt
        if (url.includes('/api/token/refresh/')) {
            throw new Error('Session expired');
        }

        try {
            const refreshToken = localStorage.getItem("refresh_token");
            if (!refreshToken) {
                throw new Error("No refresh token available");
            }

            // Attempt Refresh
            const refreshRes = await fetch(`${apiBase}/api/token/refresh/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh: refreshToken })
            });

            if (!refreshRes.ok) {
                throw new Error("Refresh failed");
            }

            const data = await refreshRes.json();
            localStorage.setItem("access_token", data.access);
            if (data.refresh) {
                localStorage.setItem("refresh_token", data.refresh);
            }

            // Retry Original Request
            headers.set("Authorization", `Bearer ${data.access}`);
            const newConfig = {
                ...options,
                headers
            };
            response = await fetch(fullUrl, newConfig);

        } catch (refreshError) {
            // Logout on failure
            console.error("Token refresh failed", refreshError);
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            window.location.href = "/auth/login";
            throw new Error("Session expired");
        }
    }

    return response;
}

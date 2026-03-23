const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://shortener.0x1.in";

interface FetchOptions extends RequestInit {
  token?: string;
}

interface ApiError {
  error: string;
}

/**
 * Base fetcher for API calls
 */
export async function fetcher<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers = new Headers(fetchOptions.headers);

  if (!headers.has("Content-Type") && !(fetchOptions.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Add authorization header if token provided
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_URL}${endpoint}`;

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;
    try {
      const errorData = (await response.json()) as ApiError;
      errorMessage = errorData.error || errorMessage;
    } catch {
      // Ignore JSON parse errors
    }
    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}

/**
 * GET request
 */
export function get<T>(endpoint: string, token?: string): Promise<T> {
  return fetcher<T>(endpoint, { method: "GET", token });
}

/**
 * POST request
 */
export function post<T>(endpoint: string, data: unknown, token?: string): Promise<T> {
  return fetcher<T>(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
    token,
  });
}

/**
 * PATCH request
 */
export function patch<T>(endpoint: string, data: unknown, token?: string): Promise<T> {
  return fetcher<T>(endpoint, {
    method: "PATCH",
    body: JSON.stringify(data),
    token,
  });
}

/**
 * DELETE request
 */
export function del<T>(endpoint: string, token?: string): Promise<T> {
  return fetcher<T>(endpoint, { method: "DELETE", token });
}

/**
 * Get token from cookie
 */
export function getSessionToken(): string | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(/session=([^;]+)/);
  return match ? match[1] : null;
}
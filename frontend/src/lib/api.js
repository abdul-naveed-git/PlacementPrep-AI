const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://placment.duckdns.org/";

export async function apiRequest(endpoint, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  let response;
  try {
    response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      credentials: "include",
    });
  } catch (networkError) {
    throw new Error(
      networkError?.message || "Unable to reach the server right now.",
      { cause: networkError },
    );
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(
      errorData.error ||
        errorData.message ||
        "An error occurred during transaction",
    );
    error.status = response.status;
    error.details = errorData;
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json().catch(() => null);
}

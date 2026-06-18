const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("pf_token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  let response;
  try {
    response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
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

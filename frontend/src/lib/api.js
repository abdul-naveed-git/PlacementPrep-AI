const API_BASE = "http://localhost:3000";

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("pf_token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error ||
      errorData.message ||
      "An error occurred during transaction",
    );
  }

  return response.json();
}

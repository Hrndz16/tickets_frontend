const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";

type HttpOptions = RequestInit & {
  skipAuth?: boolean;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

function getErrorMessage(data: unknown) {
  if (data && typeof data === "object" && "message" in data) {
    return String(data.message);
  }

  return "No se pudo completar la solicitud";
}

export async function http<T>(path: string, options: HttpOptions = {}) {
  const headers = new Headers(options.headers);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (!options.skipAuth) {
    const token = localStorage.getItem("token");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    if (response.status === 401) {
      clearSession();

      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }

    throw new ApiError(getErrorMessage(data), response.status);
  }

  return data as T;
}

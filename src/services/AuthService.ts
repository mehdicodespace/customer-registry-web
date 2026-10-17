export interface AuthUser {
  id: string;
  email: string;
}

interface AuthResponse {
  token: string;
  user: AuthUser;
}

const SESSION_KEY = "customer-registry-session";
const SESSION_EXPIRY_KEY = "customer-registry-session-expiry";

const getApiBaseUrl = (): string => {
  const baseUrl = process.env.VUE_APP_API_BASE_URL;
  if (!baseUrl) {
    throw new Error("Set VUE_APP_API_BASE_URL in the frontend .env file.");
  }
  return baseUrl.replace(/\/$/, "");
};

const request = async (path: string, body: Record<string, string>) => {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Could not sign in.");
  return data as AuthResponse;
};

const AuthService = {
  getToken(): string | null {
    const expiresAt = Number(sessionStorage.getItem(SESSION_EXPIRY_KEY));
    if (!expiresAt || Date.now() >= expiresAt) {
      this.signOut();
      return null;
    }
    return sessionStorage.getItem(SESSION_KEY);
  },

  async signIn(email: string, password: string): Promise<AuthUser> {
    const session = await request("/auth/login", { email, password });
    sessionStorage.setItem(SESSION_KEY, session.token);
    sessionStorage.setItem(SESSION_EXPIRY_KEY, String(Date.now() + 8 * 60 * 60 * 1000));
    return session.user;
  },

  async signUp(email: string, password: string): Promise<AuthUser> {
    const session = await request("/auth/register", { email, password });
    sessionStorage.setItem(SESSION_KEY, session.token);
    sessionStorage.setItem(SESSION_EXPIRY_KEY, String(Date.now() + 8 * 60 * 60 * 1000));
    return session.user;
  },

  async getCurrentUser(): Promise<AuthUser> {
    const token = this.getToken();
    if (!token) throw new Error("Sign in to continue.");
    const response = await fetch(`${getApiBaseUrl()}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (response.status === 401) this.signOut();
      throw new Error(data.error || "Your session has expired.");
    }
    return data.user as AuthUser;
  },

  signOut(): void {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_EXPIRY_KEY);
  },
};

export default AuthService;

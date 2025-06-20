const API_BASE_URL = __DEV__
  ? "http://10.73.189.20:3001/api"
  : "https://your-production-api.com/api";

// Types basés sur votre API
interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
  };
  token: string;
}

interface ApiErrorResponse {
  error: string;
  details?: string[];
}

interface ApiResponse<T> {
  data?: T;
  message?: string;
  status: number;
  error?: string;
  details?: string[];
}

interface EmailGenerationRequest {
  content: string;
  style: "professional" | "casual" | "formal" | "friendly";
  context?: string;
}

interface Draft {
  id: string;
  userId: string;
  subject: string;
  content: string;
  style: string;
  context?: string;
  createdAt: string;
  updatedAt: string;
}

interface EmailAccount {
  id: string;
  userId: string;
  email: string;
  provider: "gmail" | "outlook" | "yahoo";
  isConnected: boolean;
  createdAt: string;
}

class ApiService {
  private baseURL: string;
  private authToken: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Méthode pour définir le token d'authentification
  setAuthToken(token: string) {
    this.authToken = token;
  }

  // Méthode pour supprimer le token
  clearAuthToken() {
    this.authToken = null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    // Ajouter le token d'authentification si disponible
    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (response.ok) {
        return {
          data: data, // Les données de succès
          status: response.status,
          message: data.message,
        };
      } else {
        return {
          status: response.status,
          error: data.error || "Erreur inconnue",
          details: data.details,
          message: data.message,
        };
      }
    } catch (error: any) {
      console.error("API Request failed:", error);
      return {
        status: 500,
        error: "Erreur de connexion au serveur",
        message: error?.message || "Erreur réseau",
      };
    }
  }

  // =============================
  // AUTHENTIFICATION
  // =============================

  async register(
    userData: RegisterRequest
  ): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    return this.request<{ token: string }>("/auth/refresh", {
      method: "POST",
    });
  }

  async logout(): Promise<ApiResponse<{ message: string }>> {
    const response = await this.request<{ message: string }>("/auth/logout", {
      method: "POST",
    });

    // Nettoyer le token local après déconnexion
    this.clearAuthToken();

    return response;
  }

  // =============================
  // PROFIL UTILISATEUR
  // =============================

  async getProfile(): Promise<ApiResponse<AuthResponse["user"]>> {
    return this.request<AuthResponse["user"]>("/auth/profile");
  }

  async updateProfile(
    updates: Partial<RegisterRequest>
  ): Promise<ApiResponse<AuthResponse["user"]>> {
    return this.request<AuthResponse["user"]>("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>("/auth/change-password", {
      method: "PUT",
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });
  }

  // =============================
  // GÉNÉRATION D'EMAILS
  // =============================

  async generateEmail(
    data: EmailGenerationRequest
  ): Promise<ApiResponse<{ generatedContent: string }>> {
    return this.request<{ generatedContent: string }>("/emails/generate", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // =============================
  // BROUILLONS
  // =============================

  async getDrafts(): Promise<ApiResponse<Draft[]>> {
    return this.request<Draft[]>("/drafts");
  }

  async createDraft(
    draft: Omit<Draft, "id" | "userId" | "createdAt" | "updatedAt">
  ): Promise<ApiResponse<Draft>> {
    return this.request<Draft>("/drafts", {
      method: "POST",
      body: JSON.stringify(draft),
    });
  }

  async updateDraft(
    id: string,
    updates: Partial<Draft>
  ): Promise<ApiResponse<Draft>> {
    return this.request<Draft>(`/drafts/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  async deleteDraft(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/drafts/${id}`, {
      method: "DELETE",
    });
  }

  async getDraft(id: string): Promise<ApiResponse<Draft>> {
    return this.request<Draft>(`/drafts/${id}`);
  }

  // =============================
  // COMPTES EMAIL
  // =============================

  async getEmailAccounts(): Promise<ApiResponse<EmailAccount[]>> {
    return this.request<EmailAccount[]>("/email-accounts");
  }

  async connectEmailAccount(
    provider: "gmail" | "outlook" | "yahoo",
    authCode: string
  ): Promise<ApiResponse<EmailAccount>> {
    return this.request<EmailAccount>("/email-accounts/connect", {
      method: "POST",
      body: JSON.stringify({ provider, authCode }),
    });
  }

  async disconnectEmailAccount(
    id: string
  ): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(
      `/email-accounts/${id}/disconnect`,
      {
        method: "POST",
      }
    );
  }

  async sendEmail(
    accountId: string,
    email: {
      to: string;
      subject: string;
      content: string;
      cc?: string;
      bcc?: string;
    }
  ): Promise<ApiResponse<{ message: string; messageId: string }>> {
    return this.request<{ message: string; messageId: string }>(
      `/email-accounts/${accountId}/send`,
      {
        method: "POST",
        body: JSON.stringify(email),
      }
    );
  }

  // =============================
  // HISTORIQUE
  // =============================

  async getHistory(
    limit?: number,
    offset?: number
  ): Promise<
    ApiResponse<{
      emails: any[];
      total: number;
      page: number;
      totalPages: number;
    }>
  > {
    const params = new URLSearchParams();
    if (limit) params.append("limit", limit.toString());
    if (offset) params.append("offset", offset.toString());

    const queryString = params.toString();
    const url = queryString ? `/history?${queryString}` : "/history";

    return this.request(url);
  }

  // =============================
  // MÉTHODES UTILITAIRES
  // =============================

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    return !!this.authToken;
  }

  // Obtenir l'URL de base
  getBaseURL(): string {
    return this.baseURL;
  }

  // Méthode pour tester la connexion API
  async healthCheck(): Promise<
    ApiResponse<{ status: string; timestamp: string }>
  > {
    return this.request<{ status: string; timestamp: string }>("/health");
  }
}

// Instance singleton
export const apiService = new ApiService();

// Fonctions utilitaires pour la gestion des tokens
export const authUtils = {
  // Stocker le token (à implémenter avec AsyncStorage ou SecureStore)
  async saveToken(token: string) {
    // TODO: Implémenter avec expo-secure-store
    apiService.setAuthToken(token);
  },

  // Récupérer le token
  async getToken(): Promise<string | null> {
    // TODO: Implémenter avec expo-secure-store
    return null;
  },

  // Supprimer le token
  async removeToken() {
    // TODO: Implémenter avec expo-secure-store
    apiService.clearAuthToken();
  },

  // Initialiser l'API avec le token stocké
  async initializeAuth() {
    const token = await this.getToken();
    if (token) {
      apiService.setAuthToken(token);
    }
  },
};

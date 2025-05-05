export interface RegisterGoogleUserRequestParams {
  googleToken: string;
  userData: {
    email: string;
    name: string;
    googleId: string;
    picture?: string;
  }
}

export interface StoredToken {
  accessToken: string;
  session: {
    id: string;
    user: {
      id: string;
      email: string;
      username: string;
      avatarUrl?: string;
      fcmToken?: string;
      userOrganizations: Array<{
        id: string;
        userId: string;
        organizationId: string;
        role: "ADMIN" | "USER";
        joinedAt: Date;
      }>;
    };
    expiresAt: string;
    isValid: boolean;
    refreshTokenId?: string;
  };
}

export interface AuthError {
  message: string;
  code: string;
} 
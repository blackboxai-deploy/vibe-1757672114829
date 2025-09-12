// Authentication service for API routes
export class AuthService {
  static getCurrentUser(authHeader: string | null) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    
    // Mock JWT verification - in production, verify actual JWT
    if (token === 'mock_jwt_token') {
      return {
        userId: '2',
        email: 'radiologist@teleradiology.com',
        role: 'radiologist' as const,
        name: 'Dr. Michael Chen'
      };
    }

    return null;
  }

  static canAccessStudy(user: any, assignedTo?: string) {
    if (user.role === 'admin') return true;
    if (user.role === 'radiologist' && (!assignedTo || assignedTo === user.userId)) return true;
    if (user.role === 'reviewer') return true;
    return false;
  }
}
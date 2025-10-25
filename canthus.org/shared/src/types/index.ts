export type ApiResponse = {
  message: string;
  success: true;
}

export type User = {
  object: 'user'
  id: string
  email: string
  emailVerified: boolean
  firstName: string
  lastName: string
  profilePictureUrl: string | null
  lastSignInAt: string
  createdAt: string
  updatedAt: string
  externalId: string | null
  metadata: Record<string, unknown>
  organizations: Organization[]
}

export type AuthMeResponse =
  | { authenticated: false }
  | { authenticated: true; user: User }

export type Organization = {
  id: string
  name: string
  role: string
  createdAt: string
  updatedAt: string
  status: string
}

export type OrganizationsResponse =
  | { authenticated: false }
  | { authenticated: true; organizations: Organization[] }

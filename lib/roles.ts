import { createClient } from '@/lib/supabase'

export type UserRole = 'user' | 'admin'

export async function getUserRole(): Promise<UserRole | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  // Check user_metadata for role
  const role = user.user_metadata?.role as UserRole
  return role || 'user' // Default to 'user' role
}

export async function isAdmin(): Promise<boolean> {
  const role = await getUserRole()
  return role === 'admin'
}

export async function setUserRole(userId: string, role: UserRole) {
  const supabase = createClient()
  
  // This should be done on the server side with service role key
  // For now, this is a placeholder - actual implementation should be in backend
  const { error } = await supabase.auth.updateUser({
    data: { role }
  })
  
  if (error) {
    throw new Error(`Failed to set user role: ${error.message}`)
  }
}


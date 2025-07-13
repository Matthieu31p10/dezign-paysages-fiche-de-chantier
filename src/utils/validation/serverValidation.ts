import { supabase } from '@/integrations/supabase/client'
import { PostgrestError } from '@supabase/supabase-js'
import type { Database } from '@/integrations/supabase/types'

type TableName = keyof Database['public']['Tables']

// Server-side validation errors
export class ServerValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message)
    this.name = 'ServerValidationError'
  }
}

// Generic server validation functions
export const validateUnique = async (
  tableName: TableName,
  field: string,
  value: string,
  excludeId?: string
): Promise<boolean> => {
  try {
    let query = supabase
      .from(tableName)
      .select('id')
      .eq(field, value)

    if (excludeId) {
      query = query.neq('id', excludeId)
    }

    const { data, error } = await query.maybeSingle()

    if (error && error.code !== 'PGRST116') {
      console.error('Server validation error:', error)
      throw new ServerValidationError(`Erreur de validation serveur: ${error.message}`, field)
    }

    return !data // Return true if no data found (unique)
  } catch (error) {
    if (error instanceof ServerValidationError) {
      throw error
    }
    console.error('Server validation error:', error)
    throw new ServerValidationError('Erreur de validation serveur', field)
  }
}

export const validateExists = async (
  tableName: TableName,
  field: string,
  value: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('id')
      .eq(field, value)
      .maybeSingle()

    if (error && error.code !== 'PGRST116') {
      console.error('Server validation error:', error)
      throw new ServerValidationError(`Erreur de validation serveur: ${error.message}`, field)
    }

    return Boolean(data) // Return true if data found (exists)
  } catch (error) {
    if (error instanceof ServerValidationError) {
      throw error
    }
    console.error('Server validation error:', error)
    throw new ServerValidationError('Erreur de validation serveur', field)
  }
}

// Specific validation functions
export const validateProjectName = async (
  name: string,
  excludeId?: string
): Promise<boolean> => {
  const isUnique = await validateUnique('projects', 'name', name, excludeId)
  if (!isUnique) {
    throw new ServerValidationError('Ce nom de projet existe déjà', 'name')
  }
  return true
}

export const validateTeamName = async (
  name: string,
  excludeId?: string
): Promise<boolean> => {
  const isUnique = await validateUnique('teams', 'name', name, excludeId)
  if (!isUnique) {
    throw new ServerValidationError('Ce nom d\'équipe existe déjà', 'name')
  }
  return true
}

export const validatePersonnelName = async (
  name: string,
  excludeId?: string
): Promise<boolean> => {
  try {
    let query = supabase
      .from('personnel')
      .select('id')
      .eq('name', name)
      .eq('active', true)

    if (excludeId) {
      query = query.neq('id', excludeId)
    }

    const { data, error } = await query.maybeSingle()

    if (error && error.code !== 'PGRST116') {
      console.error('Server validation error:', error)
      throw new ServerValidationError(`Erreur de validation serveur: ${error.message}`, 'name')
    }

    const isUnique = !data
    if (!isUnique) {
      throw new ServerValidationError('Ce nom de personnel existe déjà parmi le personnel actif', 'name')
    }
    return true
  } catch (error) {
    if (error instanceof ServerValidationError) {
      throw error
    }
    console.error('Personnel validation error:', error)
    throw new ServerValidationError('Erreur de validation serveur', 'name')
  }
}

export const validateProjectExists = async (projectId: string): Promise<boolean> => {
  const exists = await validateExists('projects', 'id', projectId)
  if (!exists) {
    throw new ServerValidationError('Le projet spécifié n\'existe pas', 'project_id')
  }
  return true
}

export const validateTeamExists = async (teamId: string): Promise<boolean> => {
  const exists = await validateExists('teams', 'id', teamId)
  if (!exists) {
    throw new ServerValidationError('L\'équipe spécifiée n\'existe pas', 'team_id')
  }
  return true
}

// Business logic validations
export const validateWorkLogDateConstraints = async (
  projectId: string,
  date: string,
  excludeLogId?: string
): Promise<boolean> => {
  try {
    // Check if there's already a work log for this project on this date
    let query = supabase
      .from('work_logs')
      .select('id')
      .eq('project_id', projectId)
      .eq('date', date)

    if (excludeLogId) {
      query = query.neq('id', excludeLogId)
    }

    const { data, error } = await query.maybeSingle()

    if (error && error.code !== 'PGRST116') {
      console.error('Work log date validation error:', error)
      throw new ServerValidationError(`Erreur de validation: ${error.message}`, 'date')
    }

    if (data) {
      throw new ServerValidationError('Il existe déjà une feuille de travail pour ce projet à cette date', 'date')
    }

    return true
  } catch (error) {
    if (error instanceof ServerValidationError) {
      throw error
    }
    console.error('Work log date validation error:', error)
    throw new ServerValidationError('Erreur de validation de date', 'date')
  }
}

export const validateProjectTeamAssignment = async (
  projectId: string,
  teamId: string,
  excludeAssignmentId?: string
): Promise<boolean> => {
  try {
    // Check if this team is already assigned to this project
    let query = supabase
      .from('project_teams')
      .select('id')
      .eq('project_id', projectId)
      .eq('team_id', teamId)

    if (excludeAssignmentId) {
      query = query.neq('id', excludeAssignmentId)
    }

    const { data, error } = await query.maybeSingle()

    if (error && error.code !== 'PGRST116') {
      console.error('Project team validation error:', error)
      throw new ServerValidationError(`Erreur de validation: ${error.message}`, 'team_id')
    }

    if (data) {
      throw new ServerValidationError('Cette équipe est déjà assignée à ce projet', 'team_id')
    }

    return true
  } catch (error) {
    if (error instanceof ServerValidationError) {
      throw error
    }
    console.error('Project team validation error:', error)
    throw new ServerValidationError('Erreur de validation d\'assignation', 'team_id')
  }
}

// Helper function to handle PostgrestError
export const handlePostgrestError = (error: PostgrestError, context: string): never => {
  console.error(`${context}:`, error)
  
  // Map common PostgreSQL error codes to user-friendly messages
  switch (error.code) {
    case '23505': // unique_violation
      throw new ServerValidationError('Cette valeur existe déjà')
    case '23503': // foreign_key_violation
      throw new ServerValidationError('Référence invalide')
    case '23514': // check_violation
      throw new ServerValidationError('Valeur non autorisée')
    case '23502': // not_null_violation
      throw new ServerValidationError('Champ requis manquant')
    default:
      throw new ServerValidationError('Erreur de validation serveur')
  }
}
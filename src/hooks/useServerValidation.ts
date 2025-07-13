import { useCallback } from 'react'
import { z } from 'zod'
import { supabase } from '@/integrations/supabase/client'
import { toast } from '@/hooks/use-toast'
import type { Database } from '@/integrations/supabase/types'

type TableName = keyof Database['public']['Tables']

interface ServerValidationOptions {
  showToast?: boolean
  tableName: string
}

export const useServerValidation = () => {
  const validateUnique = useCallback(async (
    field: string,
    value: string,
    tableName: TableName,
    excludeId?: string
  ): Promise<boolean> => {
    try {
      let query = supabase
        .from(tableName as any)
        .select('id')
        .eq(field, value)

      if (excludeId) {
        query = query.neq('id', excludeId)
      }

      const { data, error } = await query.maybeSingle()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('Server validation error:', error)
        return false
      }

      return !data // Return true if no data found (unique)
    } catch (error) {
      console.error('Server validation error:', error)
      return false
    }
  }, [])

  const validateExists = useCallback(async (
    field: string,
    value: string,
    tableName: TableName
  ): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from(tableName as any)
        .select('id')
        .eq(field, value)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') {
        console.error('Server validation error:', error)
        return false
      }

      return Boolean(data) // Return true if data found (exists)
    } catch (error) {
      console.error('Server validation error:', error)
      return false
    }
  }, [])

  const validateRelationship = useCallback(async (
    foreignKey: string,
    foreignKeyValue: string,
    tableName: TableName
  ): Promise<boolean> => {
    return validateExists(foreignKey, foreignKeyValue, tableName)
  }, [validateExists])

  // Validation for project names (must be unique)
  const validateProjectName = useCallback(async (
    name: string,
    excludeId?: string
  ): Promise<boolean> => {
    const isUnique = await validateUnique('name', name, 'projects', excludeId)
    if (!isUnique) {
      toast({
        title: 'Nom déjà utilisé',
        description: 'Ce nom de projet existe déjà',
        variant: 'destructive'
      })
    }
    return isUnique
  }, [validateUnique])

  // Validation for team names (must be unique)
  const validateTeamName = useCallback(async (
    name: string,
    excludeId?: string
  ): Promise<boolean> => {
    const isUnique = await validateUnique('name', name, 'teams', excludeId)
    if (!isUnique) {
      toast({
        title: 'Nom déjà utilisé',
        description: 'Ce nom d\'équipe existe déjà',
        variant: 'destructive'
      })
    }
    return isUnique
  }, [validateUnique])

  // Validation for personnel names (should be unique within active personnel)
  const validatePersonnelName = useCallback(async (
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
        return false
      }

      const isUnique = !data
      if (!isUnique) {
        toast({
          title: 'Nom déjà utilisé',
          description: 'Ce nom de personnel existe déjà parmi le personnel actif',
          variant: 'destructive'
        })
      }
      return isUnique
    } catch (error) {
      console.error('Personnel validation error:', error)
      return false
    }
  }, [])

  // Validation for project existence (for work logs)
  const validateProjectExists = useCallback(async (
    projectId: string
  ): Promise<boolean> => {
    const exists = await validateExists('id', projectId, 'projects')
    if (!exists) {
      toast({
        title: 'Projet introuvable',
        description: 'Le projet spécifié n\'existe pas',
        variant: 'destructive'
      })
    }
    return exists
  }, [validateExists])

  // Validation for team existence (for project teams)
  const validateTeamExists = useCallback(async (
    teamId: string
  ): Promise<boolean> => {
    const exists = await validateExists('id', teamId, 'teams')
    if (!exists) {
      toast({
        title: 'Équipe introuvable',
        description: 'L\'équipe spécifiée n\'existe pas',
        variant: 'destructive'
      })
    }
    return exists
  }, [validateExists])

  return {
    validateUnique,
    validateExists,
    validateRelationship,
    validateProjectName,
    validateTeamName,
    validatePersonnelName,
    validateProjectExists,
    validateTeamExists
  }
}
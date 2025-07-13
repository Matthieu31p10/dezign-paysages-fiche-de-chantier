import { useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { toast } from '@/hooks/use-toast'

export const useCreateDefaultAdmin = () => {
  useEffect(() => {
    const createDefaultAdmin = async () => {
      try {
        // Check if any admin users exist
        const { data: existingAdmins, error: fetchError } = await supabase
          .from('profiles')
          .select('id')
          .eq('role', 'admin')
          .limit(1)

        if (fetchError) {
          console.error('Error checking for existing admins:', fetchError)
          return
        }

        // If admin exists, don't create another one
        if (existingAdmins && existingAdmins.length > 0) {
          return
        }

        // Create default admin user
        const { data, error } = await supabase.auth.signUp({
          email: 'admin@example.com',
          password: 'admin123',
          options: {
            data: {
              first_name: 'Admin',
              last_name: 'User',
              role: 'admin',
              permissions: {
                projects: true,
                worklogs: true,
                reports: true,
                blanksheets: true,
                admin: true
              }
            }
          }
        })

        if (error) {
          console.error('Error creating default admin:', error)
        } else {
          console.log('Default admin created successfully')
          toast({
            title: 'Compte administrateur créé',
            description: 'Email: admin@example.com, Mot de passe: admin123',
          })
        }
      } catch (error) {
        console.error('Error in createDefaultAdmin:', error)
      }
    }

    createDefaultAdmin()
  }, [])
}
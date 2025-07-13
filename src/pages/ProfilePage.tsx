import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/context/SupabaseAuthContext'
import { LoadingButton } from '@/components/loading'
import { User, Mail, Calendar, Shield } from 'lucide-react'
import { useState } from 'react'

export const ProfilePage = () => {
  const { profile, user, updateProfile, loading } = useAuth()
  const [firstName, setFirstName] = useState(profile?.first_name || '')
  const [lastName, setLastName] = useState(profile?.last_name || '')
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)

    await updateProfile({
      first_name: firstName,
      last_name: lastName,
    })

    setIsUpdating(false)
  }

  const getRoleBadge = (role: string) => {
    const roleColors = {
      admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      manager: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      user: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    }

    const roleLabels = {
      admin: 'Administrateur',
      manager: 'Manager',
      user: 'Utilisateur',
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[role as keyof typeof roleColors]}`}>
        <Shield className="w-3 h-3 mr-1" />
        {roleLabels[role as keyof typeof roleLabels]}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="h-8 bg-muted rounded animate-pulse" />
          <div className="h-64 bg-muted rounded animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Mon Profil</h1>
          <p className="text-muted-foreground">
            Gérez vos informations personnelles et vos préférences
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations personnelles
            </CardTitle>
            <CardDescription>
              Mettez à jour vos informations de profil
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Votre prénom"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Votre nom"
                  />
                </div>
              </div>

              <LoadingButton
                type="submit"
                loading={isUpdating}
                loadingText="Mise à jour..."
                className="w-full"
              >
                Mettre à jour le profil
              </LoadingButton>
            </form>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informations du compte</h3>
              
              <div className="grid gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Rôle</p>
                    <div className="mt-1">
                      {profile?.role && getRoleBadge(profile.role)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Membre depuis</p>
                    <p className="text-sm text-muted-foreground">
                      {profile?.created_at && new Date(profile.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
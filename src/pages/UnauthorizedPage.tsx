import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShieldAlert } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const UnauthorizedPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <ShieldAlert className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-xl">Accès refusé</CardTitle>
          <CardDescription>
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Contactez votre administrateur si vous pensez que c'est une erreur.
          </p>
          <div className="flex gap-2 justify-center">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
            >
              Retour
            </Button>
            <Button 
              onClick={() => navigate('/')}
            >
              Accueil
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
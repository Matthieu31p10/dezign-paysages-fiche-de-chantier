
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ClientConnection } from '@/types/models';
import { clientConnectionsService } from '@/services/clientConnectionsService';
import { toast } from 'sonner';

export const useClientConnections = () => {
  const queryClient = useQueryClient();

  const {
    data: clientConnections = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['clientConnections'],
    queryFn: clientConnectionsService.getAll
  });

  const createMutation = useMutation({
    mutationFn: clientConnectionsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientConnections'] });
      toast.success('Client créé avec succès');
    },
    onError: (error: any) => {
      console.error('Error creating client:', error);
      if (error.code === '23505') {
        toast.error('Cet email est déjà utilisé');
      } else {
        toast.error('Erreur lors de la création du client');
      }
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ClientConnection> }) =>
      clientConnectionsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientConnections'] });
      toast.success('Client mis à jour avec succès');
    },
    onError: (error: any) => {
      console.error('Error updating client:', error);
      if (error.code === '23505') {
        toast.error('Cet email est déjà utilisé');
      } else {
        toast.error('Erreur lors de la mise à jour du client');
      }
    }
  });

  const deleteMutation = useMutation({
    mutationFn: clientConnectionsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientConnections'] });
      toast.success('Client supprimé avec succès');
    },
    onError: (error) => {
      console.error('Error deleting client:', error);
      toast.error('Erreur lors de la suppression du client');
    }
  });

  return {
    clientConnections,
    isLoading,
    error,
    createClient: createMutation.mutate,
    updateClient: updateMutation.mutate,
    deleteClient: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
};

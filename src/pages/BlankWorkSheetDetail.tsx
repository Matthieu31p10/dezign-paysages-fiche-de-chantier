
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { useBlankWorksheets } from '@/context/BlankWorksheetsContext/BlankWorksheetsContext';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

const BlankWorkSheetDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getBlankWorksheetById, deleteBlankWorksheet } = useBlankWorksheets();
  const [isLoading, setIsLoading] = useState(true);
  
  const worksheet = id ? getBlankWorksheetById(id) : undefined;
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [id, worksheet]);
  
  const handleEdit = () => {
    navigate(`/blank-worksheets/${id}/edit`);
  };
  
  const handleDelete = async () => {
    if (!id || !worksheet) return;
    
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette fiche vierge ?')) {
      try {
        await deleteBlankWorksheet(id);
        toast.success('Fiche vierge supprimée avec succès');
        navigate('/blank-worksheets');
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };
  
  const handleReturn = () => {
    navigate('/blank-worksheets');
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!worksheet) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-medium mb-4 text-blue-800">Fiche vierge non trouvée</h2>
        <p className="text-muted-foreground mb-6">
          La fiche vierge que vous cherchez n'existe pas ou a été supprimée.
        </p>
        <Button onClick={handleReturn} className="bg-blue-600 hover:bg-blue-700">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à la liste
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 mr-2 text-blue-700 hover:text-blue-800 hover:bg-blue-100"
            onClick={handleReturn}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour
          </Button>
          <h1 className="text-2xl font-semibold text-blue-800">Détail de la fiche vierge</h1>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700">
            <Edit className="w-4 h-4 mr-2" />
            Modifier
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Supprimer
          </Button>
        </div>
      </div>
      
      <Card className="p-6 border-blue-200 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Informations générales</h3>
            <div className="space-y-2">
              <p><strong>Date:</strong> {worksheet.date}</p>
              <p><strong>Client:</strong> {worksheet.client_name || 'Non spécifié'}</p>
              <p><strong>Adresse:</strong> {worksheet.address || 'Non spécifiée'}</p>
              <p><strong>Personnel:</strong> {worksheet.personnel.join(', ')}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Temps et facturation</h3>
            <div className="space-y-2">
              <p><strong>Heures totales:</strong> {worksheet.total_hours}h</p>
              <p><strong>Facturé:</strong> {worksheet.invoiced ? 'Oui' : 'Non'}</p>
              {worksheet.hourly_rate && (
                <p><strong>Taux horaire:</strong> {worksheet.hourly_rate}€</p>
              )}
            </div>
          </div>
        </div>
        
        {worksheet.notes && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Notes</h3>
            <p className="text-gray-700">{worksheet.notes}</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default BlankWorkSheetDetail;

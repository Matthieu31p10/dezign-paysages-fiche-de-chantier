
import React from 'react';
import CompanyLogo from '@/components/ui/company-logo';
import { PDFOptions } from '../WorkLogDetailContext';

interface PreviewTabProps {
  theme: string;
  pdfOptions: PDFOptions;
}

const PreviewTab: React.FC<PreviewTabProps> = ({ theme, pdfOptions }) => {
  return (
    <div className="py-4">
      <div className="border rounded-md p-4 flex flex-col items-center">
        <div className="w-full max-w-md bg-white shadow-sm rounded-md border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
              <CompanyLogo className="w-14 h-14 p-1" />
            </div>
            <div>
              <h3 className="font-bold">Fiche de suivi</h3>
              <p className="text-sm text-gray-600">3 avril 2025</p>
            </div>
          </div>
          
          <div className="text-center my-3">
            <h4 className="font-medium">Détails du passage</h4>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-sm mb-3">
            <div>
              <span className="text-gray-500 text-xs">Date</span>
              <p>03/04/2025</p>
            </div>
            <div>
              <span className="text-gray-500 text-xs">Durée prévue</span>
              <p>5 heures</p>
            </div>
            <div>
              <span className="text-gray-500 text-xs">Temps total</span>
              <p>4.33 heures</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className={`p-2 rounded text-xs ${theme === 'professional' ? 'bg-slate-100' : theme === 'nature' ? 'bg-green-50' : 'bg-gray-50'}`}>
              <span className="text-gray-500">Écart du temps</span>
              <p className={`font-bold ${theme === 'nature' ? 'text-green-700' : 'text-green-600'}`}>+1.56 h</p>
            </div>
            <div className={`p-2 rounded text-xs ${theme === 'professional' ? 'bg-slate-100' : theme === 'nature' ? 'bg-green-50' : 'bg-gray-50'}`}>
              <span className="text-gray-500">Gestion déchets</span>
              <p>1 Big-bag</p>
            </div>
          </div>
          
          <div className="text-xs text-gray-400 mt-3">
            Aperçu simplifié du thème: {theme || 'default'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewTab;

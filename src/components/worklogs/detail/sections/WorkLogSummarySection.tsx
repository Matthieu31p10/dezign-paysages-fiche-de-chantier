
import React from 'react';
import { Calendar, Clock, User, Building2, Users } from 'lucide-react';
import { useWorkLogDetail } from '../WorkLogDetailContext';
import { formatDate } from '@/utils/helpers';
import { useApp } from '@/context/AppContext';

const WorkLogSummarySection: React.FC = () => {
  const { workLog, project } = useWorkLogDetail();
  const { teams } = useApp();
  
  if (!workLog) return null;
  
  // Get team name
  const teamName = project && teams.find(team => team.id === project.team)?.name;
  
  // Calculate total team hours
  const totalTeamHours = workLog.timeTracking?.totalHours 
    ? workLog.timeTracking.totalHours * (workLog.personnel?.length || 1)
    : 0;
  
  return (
    <div className="bg-gradient-to-r from-green-50 to-white p-4 rounded-lg border border-green-200">
      <h3 className="text-lg font-semibold text-green-800 mb-3">Résumé de l'intervention</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-green-600" />
            <span className="text-sm font-medium mr-2">Date:</span>
            <span className="text-sm">{formatDate(workLog.date)}</span>
          </div>
          
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-green-600" />
            <span className="text-sm font-medium mr-2">Heures effectuées (équipe):</span>
            <span className="text-sm font-semibold">{totalTeamHours.toFixed(2)} h</span>
          </div>
          
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2 text-green-600" />
            <span className="text-sm font-medium mr-2">Personnel:</span>
            <span className="text-sm">{workLog.personnel?.length || 0} personne{(workLog.personnel?.length || 0) > 1 ? 's' : ''}</span>
          </div>
        </div>
        
        <div className="space-y-3">
          {project && (
            <div className="flex items-center">
              <Building2 className="w-4 h-4 mr-2 text-green-600" />
              <span className="text-sm font-medium mr-2">Chantier:</span>
              <span className="text-sm">{project.name}</span>
            </div>
          )}
          
          {teamName && (
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2 text-green-600" />
              <span className="text-sm font-medium mr-2">Équipe responsable:</span>
              <span className="text-sm">{teamName}</span>
            </div>
          )}
          
          {workLog.timeTracking?.departure && workLog.timeTracking?.end && (
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-green-600" />
              <span className="text-sm font-medium mr-2">Horaires:</span>
              <span className="text-sm">{workLog.timeTracking.departure} - {workLog.timeTracking.end}</span>
            </div>
          )}
        </div>
      </div>
      
      {workLog.personnel && workLog.personnel.length > 0 && (
        <div className="mt-3 pt-3 border-t border-green-200">
          <span className="text-sm font-medium text-green-700">Personnel présent:</span>
          <div className="flex flex-wrap gap-2 mt-1">
            {workLog.personnel.map((person, index) => (
              <span key={index} className="inline-flex items-center px-2 py-1 rounded-md bg-green-100 text-green-700 text-xs">
                {person}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkLogSummarySection;

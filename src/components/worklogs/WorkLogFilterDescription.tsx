
interface WorkLogFilterDescriptionProps {
  selectedProjectId: string | 'all';
  selectedMonth: number | 'all';
  selectedYear: number;
  projectName?: string;
}

export const WorkLogFilterDescription = ({ 
  selectedProjectId, 
  selectedMonth, 
  selectedYear,
  projectName
}: WorkLogFilterDescriptionProps) => {
  // Format the description based on selected filters
  let description = selectedProjectId === 'all'
    ? 'Toutes les fiches de suivi'
    : `Fiches de suivi pour ${projectName || 'ce chantier'}`;
  
  // Add month if selected
  if (selectedMonth !== 'all') {
    description += ` - ${new Date(0, Number(selectedMonth) - 1).toLocaleString('fr-FR', { month: 'long' })}`;
  }
  
  // Add year
  description += ` - ${selectedYear}`;
  
  return <p>{description}</p>;
};

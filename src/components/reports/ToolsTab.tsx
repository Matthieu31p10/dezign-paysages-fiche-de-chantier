
import PDFGenerator from '@/components/reports/PDFGenerator';
import CalendarView from '@/components/worklogs/CalendarView';
import { useApp } from '@/context/AppContext';

const ToolsTab = () => {
  const { workLogs } = useApp();
  
  // Safety checks for data
  const validWorkLogs = Array.isArray(workLogs) ? workLogs : [];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <PDFGenerator />
      <CalendarView workLogs={validWorkLogs} />
    </div>
  );
};

export default ToolsTab;

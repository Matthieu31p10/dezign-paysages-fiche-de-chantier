
import { WorkLog } from '@/types/models';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface NoResultsStateProps {
  search: string;
  setSearch: (value: string) => void;
  selectedYear: number;
  setSelectedYear: (value: number) => void;
  availableYears: number[];
}

const NoResultsState = ({ 
  search, 
  setSearch, 
  selectedYear, 
  setSelectedYear, 
  availableYears 
}: NoResultsStateProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center justify-between">
        <div className="w-full md:w-64">
          <Input
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Select
            value={selectedYear.toString()}
            onValueChange={(value) => setSelectedYear(parseInt(value))}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Année" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="text-center py-8">
        <p className="text-muted-foreground">Aucun résultat trouvé</p>
      </div>
    </div>
  );
};

export default NoResultsState;

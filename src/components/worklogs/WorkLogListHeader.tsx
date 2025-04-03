
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface WorkLogListHeaderProps {
  search: string;
  setSearch: (value: string) => void;
  sortOption: string;
  setSortOption: (value: string) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  availableYears: number[];
}

export const WorkLogListHeader = ({
  search,
  setSearch,
  sortOption,
  setSortOption,
  selectedYear,
  setSelectedYear,
  availableYears
}: WorkLogListHeaderProps) => {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center justify-between">
      <div className="w-full md:w-64">
        <Input
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <Select
          value={sortOption}
          onValueChange={(value) => setSortOption(value)}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">Date (récent → ancien)</SelectItem>
            <SelectItem value="date-asc">Date (ancien → récent)</SelectItem>
            <SelectItem value="project-asc">Chantier (A → Z)</SelectItem>
            <SelectItem value="project-desc">Chantier (Z → A)</SelectItem>
            <SelectItem value="hours-desc">Heures (plus → moins)</SelectItem>
            <SelectItem value="hours-asc">Heures (moins → plus)</SelectItem>
          </SelectContent>
        </Select>
        
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
  );
};

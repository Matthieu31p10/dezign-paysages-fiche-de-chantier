
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

interface SearchBarProps {
  searchQuery: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar = ({ searchQuery, handleSearchChange }: SearchBarProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rechercher des fiches de suivi</CardTitle>
        <CardDescription>
          Filtrer les fiches de suivi par nom de chantier ou notes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4" />
          <Input
            type="search"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchBar;

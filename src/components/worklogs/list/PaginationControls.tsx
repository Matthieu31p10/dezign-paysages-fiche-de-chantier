
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Pagination,
  PaginationContent,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  perPage: number;
  handlePageChange: (page: number) => void;
  handlePerPageChange: (value: string) => void;
}

const PaginationControls = ({ 
  currentPage, 
  totalPages, 
  perPage, 
  handlePageChange,
  handlePerPageChange
}: PaginationControlsProps) => {
  return (
    <div className="flex items-center justify-between px-4">
      <div className="space-x-2">
        <Label htmlFor="perPage">Fiches par page</Label>
        <Select
          value={String(perPage)}
          onValueChange={handlePerPageChange}
        >
          <SelectTrigger id="perPage">
            <SelectValue placeholder="Fiches par page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationPrevious
            href={currentPage > 1 ? `?page=${currentPage - 1}` : "#"}
            onClick={(e) => {
              if (currentPage > 1) {
                e.preventDefault();
                handlePageChange(currentPage - 1);
              } else {
                e.preventDefault();
              }
            }}
            aria-disabled={currentPage === 1}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
          />
          <PaginationNext
            href={currentPage < totalPages ? `?page=${currentPage + 1}` : "#"}
            onClick={(e) => {
              if (currentPage < totalPages) {
                e.preventDefault();
                handlePageChange(currentPage + 1);
              } else {
                e.preventDefault();
              }
            }}
            aria-disabled={currentPage === totalPages}
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PaginationControls;

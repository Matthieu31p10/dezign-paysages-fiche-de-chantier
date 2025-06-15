
import { BlankWorksheet } from '@/types/blankWorksheet';

export const useBlankWorksheetQueries = (blankWorksheets: BlankWorksheet[]) => {
  const getBlankWorksheetById = (id: string) => {
    return blankWorksheets.find((worksheet) => worksheet.id === id);
  };

  return {
    getBlankWorksheetById
  };
};

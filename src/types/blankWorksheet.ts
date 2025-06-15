
export interface BlankWorksheet {
  id: string;
  date: string;
  personnel: string[];
  departure?: string;
  arrival?: string;
  end_time?: string;
  break_time?: string;
  total_hours: number;
  water_consumption?: number;
  waste_management?: string;
  tasks?: string;
  notes?: string;
  invoiced?: boolean;
  is_archived?: boolean;
  client_signature?: string;
  client_name?: string;
  address?: string;
  contact_phone?: string;
  contact_email?: string;
  hourly_rate?: number;
  linked_project_id?: string;
  signed_quote_amount?: number;
  is_quote_signed?: boolean;
  created_at?: Date;
  created_by?: string;
  consumables?: BlankWorksheetConsumable[];
}

export interface BlankWorksheetConsumable {
  id: string;
  blank_worksheet_id?: string;
  supplier: string;
  product: string;
  unit: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  saved_for_reuse?: boolean;
}

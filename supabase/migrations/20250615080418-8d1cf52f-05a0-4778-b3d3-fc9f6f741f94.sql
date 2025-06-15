
-- Créer une nouvelle table pour les fiches vierges
CREATE TABLE public.blank_worksheets (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date text NOT NULL,
  personnel text[] NOT NULL DEFAULT '{}',
  departure text,
  arrival text,
  end_time text,
  break_time text,
  total_hours numeric NOT NULL DEFAULT 0,
  water_consumption numeric DEFAULT 0,
  waste_management text DEFAULT 'none',
  tasks text,
  notes text,
  invoiced boolean DEFAULT false,
  is_archived boolean DEFAULT false,
  client_signature text,
  client_name text,
  address text,
  contact_phone text,
  contact_email text,
  hourly_rate numeric,
  linked_project_id uuid,
  signed_quote_amount numeric,
  is_quote_signed boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  created_by text
);

-- Créer une table pour les consommables des fiches vierges
CREATE TABLE public.blank_worksheet_consumables (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  blank_worksheet_id uuid REFERENCES public.blank_worksheets(id) ON DELETE CASCADE,
  supplier text NOT NULL,
  product text NOT NULL,
  unit text NOT NULL,
  quantity numeric NOT NULL,
  unit_price numeric NOT NULL,
  total_price numeric NOT NULL,
  saved_for_reuse boolean DEFAULT false
);

-- Migrer les fiches vierges existantes de work_logs vers blank_worksheets
INSERT INTO public.blank_worksheets (
  id, date, personnel, departure, arrival, end_time, break_time, total_hours,
  water_consumption, waste_management, tasks, notes, invoiced, is_archived,
  client_signature, client_name, address, contact_phone, contact_email,
  hourly_rate, linked_project_id, signed_quote_amount, is_quote_signed,
  created_at, created_by
)
SELECT 
  id, date, personnel, departure, arrival, end_time, break_time, total_hours,
  water_consumption, waste_management, tasks, notes, invoiced, is_archived,
  client_signature, client_name, address, contact_phone, contact_email,
  hourly_rate, linked_project_id, signed_quote_amount, is_quote_signed,
  created_at, created_by
FROM public.work_logs 
WHERE is_blank_worksheet = true;

-- Migrer les consommables des fiches vierges
INSERT INTO public.blank_worksheet_consumables (
  id, blank_worksheet_id, supplier, product, unit, quantity, unit_price, total_price, saved_for_reuse
)
SELECT 
  c.id, c.work_log_id, c.supplier, c.product, c.unit, c.quantity, c.unit_price, c.total_price, c.saved_for_reuse
FROM public.consumables c
INNER JOIN public.work_logs wl ON c.work_log_id = wl.id
WHERE wl.is_blank_worksheet = true;

-- Supprimer les consommables des fiches vierges de la table consumables
DELETE FROM public.consumables 
WHERE work_log_id IN (
  SELECT id FROM public.work_logs WHERE is_blank_worksheet = true
);

-- Supprimer les fiches vierges de la table work_logs
DELETE FROM public.work_logs WHERE is_blank_worksheet = true;

-- Supprimer la colonne is_blank_worksheet de work_logs car elle n'est plus nécessaire
ALTER TABLE public.work_logs DROP COLUMN IF EXISTS is_blank_worksheet;

-- Ajouter une contrainte pour s'assurer que project_id n'est pas null dans work_logs
ALTER TABLE public.work_logs ALTER COLUMN project_id SET NOT NULL;

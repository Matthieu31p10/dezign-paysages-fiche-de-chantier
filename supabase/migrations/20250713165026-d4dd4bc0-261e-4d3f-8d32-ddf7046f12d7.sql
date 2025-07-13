-- Enhance settings table to store all application parameters
ALTER TABLE public.settings 
ADD COLUMN IF NOT EXISTS hourly_rate NUMERIC DEFAULT 45,
ADD COLUMN IF NOT EXISTS vat_rate TEXT DEFAULT '20',
ADD COLUMN IF NOT EXISTS default_work_start_time TEXT DEFAULT '08:00',
ADD COLUMN IF NOT EXISTS default_work_end_time TEXT DEFAULT '17:00',
ADD COLUMN IF NOT EXISTS default_break_time TEXT DEFAULT '30',
ADD COLUMN IF NOT EXISTS auto_save_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS theme_preference TEXT DEFAULT 'system',
ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"email": true, "browser": true, "reminders": true}'::jsonb,
ADD COLUMN IF NOT EXISTS user_preferences JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS app_configuration JSONB DEFAULT '{}'::jsonb;

-- Create RLS policies for settings
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.settings
FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON public.settings  
FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON public.settings
FOR UPDATE USING (true);

-- Ensure there's always one settings record
INSERT INTO public.settings (
  company_name,
  company_email,
  company_phone,
  company_address,
  hourly_rate,
  vat_rate,
  default_work_start_time,
  default_work_end_time,
  default_break_time,
  auto_save_enabled,
  theme_preference,
  notification_preferences,
  user_preferences,
  app_configuration
)
SELECT 
  'Vertos Chantiers',
  'contact@vertos-chantiers.fr',
  '+33 1 23 45 67 89',
  '123 Rue de la Nature, 75001 Paris',
  45,
  '20',
  '08:00',
  '17:00',
  '30',
  true,
  'system',
  '{"email": true, "browser": true, "reminders": true}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.settings);

-- Create function to update updated_at automatically
CREATE OR REPLACE FUNCTION public.update_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
DROP TRIGGER IF EXISTS update_settings_updated_at ON public.settings;
CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON public.settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_settings_updated_at();
-- Create login history table
CREATE TABLE public.login_history (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    user_email TEXT NOT NULL,
    user_name TEXT NOT NULL,
    login_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    user_agent TEXT,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.login_history ENABLE ROW LEVEL SECURITY;

-- Create policies for login history access
CREATE POLICY "Admins can view all login history" 
ON public.login_history 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert login history" 
ON public.login_history 
FOR INSERT 
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can delete login history" 
ON public.login_history 
FOR DELETE 
USING (is_admin(auth.uid()));

-- Create index for better performance
CREATE INDEX idx_login_history_login_time ON public.login_history(login_time DESC);
CREATE INDEX idx_login_history_user_id ON public.login_history(user_id);
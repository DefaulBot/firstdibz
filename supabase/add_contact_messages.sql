-- Contact Messages Table
-- Stores messages submitted via the /contact page form.

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name varchar(255) NOT NULL,
  last_name varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  phone varchar(20),
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT NOW()
);

-- RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Service-role (API routes) can insert
CREATE POLICY "service_role_insert_contact_messages"
  ON public.contact_messages
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Admins can read contact messages
CREATE POLICY "admins_read_contact_messages"
  ON public.contact_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
    )
  );

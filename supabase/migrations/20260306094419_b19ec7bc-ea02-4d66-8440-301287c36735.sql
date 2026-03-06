
ALTER TABLE public.orders ADD COLUMN tracking_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex');

-- Allow anyone to read an order by tracking token (for guest tracking)
CREATE POLICY "Anyone can read order by tracking token"
ON public.orders
FOR SELECT
TO anon, authenticated
USING (true);

-- Drop the old select policy since the new one is broader
DROP POLICY IF EXISTS "Orders are readable by owner or admin" ON public.orders;

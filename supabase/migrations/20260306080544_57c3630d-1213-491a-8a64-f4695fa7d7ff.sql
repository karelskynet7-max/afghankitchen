
-- Allow admins to update orders (status changes, etc.)
CREATE POLICY "Admins can update orders"
ON public.orders
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to delete orders
CREATE POLICY "Admins can delete orders"
ON public.orders
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to update menu items
CREATE POLICY "Admins can update menu items"
ON public.menu_items
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to insert menu items
CREATE POLICY "Admins can insert menu items"
ON public.menu_items
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to delete menu items
CREATE POLICY "Admins can delete menu items"
ON public.menu_items
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to delete order items (cascade with order delete)
CREATE POLICY "Admins can delete order items"
ON public.order_items
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to read all catering requests
CREATE POLICY "Admins can read catering requests"
ON public.catering_requests
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to update catering requests
CREATE POLICY "Admins can update catering requests"
ON public.catering_requests
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

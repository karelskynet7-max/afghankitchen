import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { CartItem } from "@/hooks/useCart";

interface OrderData {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress?: string;
  orderType: "pickup" | "delivery";
  paymentMethod: "cash" | "crypto";
  notes?: string;
  items: CartItem[];
  totalPrice: number;
  userId?: string | null;
}

export const useSubmitOrder = () => {
  return useMutation({
    mutationFn: async (order: OrderData) => {
      // Create order
      const { data: orderRow, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_name: order.customerName,
          customer_phone: order.customerPhone,
          customer_email: order.customerEmail || null,
          delivery_address: order.deliveryAddress || null,
          order_type: order.orderType,
          notes: order.notes || null,
          total_price: order.totalPrice,
          payment_method: order.paymentMethod,
          user_id: order.userId || null,
        })
        .select("id")
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = order.items.map((item) => ({
        order_id: orderRow.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) throw itemsError;

      // Fetch the tracking token
      const { data: orderWithToken } = await supabase
        .from("orders")
        .select("tracking_token")
        .eq("id", orderRow.id)
        .single();

      return { id: orderRow.id, trackingToken: orderWithToken?.tracking_token || null };
    },
  });
};

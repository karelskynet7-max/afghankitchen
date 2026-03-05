import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CateringRequestData {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  guestCount: number;
  eventDate: string;
  eventType?: string;
  dietaryRequirements?: string[];
  message?: string;
}

export const useSubmitCateringRequest = () => {
  return useMutation({
    mutationFn: async (data: CateringRequestData) => {
      const { data: row, error } = await supabase
        .from("catering_requests")
        .insert({
          company_name: data.companyName,
          contact_name: data.contactName,
          email: data.email,
          phone: data.phone,
          guest_count: data.guestCount,
          event_date: data.eventDate,
          event_type: data.eventType || null,
          dietary_requirements: data.dietaryRequirements || null,
          message: data.message || null,
        })
        .select("id")
        .single();

      if (error) throw error;
      return row.id;
    },
  });
};

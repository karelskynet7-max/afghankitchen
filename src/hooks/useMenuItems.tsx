import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DbMenuItem {
  id: number;
  name: { nl: string; en: string; da: string };
  nameDari: string;
  desc: { nl: string; en: string; da: string };
  price: number;
  image: string;
  category: string;
  tags: string[];
  prepTime: string;
  popular: boolean;
  spiceLevel: number;
}

// Fallback images mapped by category
const fallbackImages: Record<string, string> = {
  rice: "/placeholder.svg",
  kebabs: "/placeholder.svg",
  appetizers: "/placeholder.svg",
  drinks: "/placeholder.svg",
};

export const useMenuItems = () => {
  return useQuery({
    queryKey: ["menu-items"],
    queryFn: async (): Promise<DbMenuItem[]> => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .eq("available", true)
        .order("popular", { ascending: false })
        .order("category")
        .order("id");

      if (error) throw error;

      return (data ?? []).map((item) => ({
        id: item.id,
        name: { nl: item.name_nl, en: item.name_en, da: item.name_da },
        nameDari: item.name_dari,
        desc: { nl: item.desc_nl, en: item.desc_en, da: item.desc_da },
        price: Number(item.price),
        image: item.image_url || fallbackImages[item.category] || "/placeholder.svg",
        category: item.category,
        tags: item.tags ?? [],
        prepTime: item.prep_time ?? "",
        popular: item.popular ?? false,
        spiceLevel: item.spice_level ?? 0,
      }));
    },
  });
};

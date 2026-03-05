import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { guests = 1, lang = "en" } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch available menu items (exclude raw category)
    const { data: items, error } = await supabase
      .from("menu_items")
      .select("id, name_en, name_nl, name_da, name_dari, price, category, tags, spice_level, image_url")
      .eq("available", true)
      .neq("category", "raw");

    if (error) throw error;

    const menuSummary = items
      .map((i) => `[ID:${i.id}] ${i.name_en} (€${i.price}, ${i.category}, tags: ${(i.tags ?? []).join(", ")})`)
      .join("\n");

    const langMap: Record<string, string> = {
      nl: "Dutch",
      en: "English",
      da: "Dari (Persian)",
    };

    const systemPrompt = `You are a friendly Afghan cuisine expert at Ariana restaurant. You suggest complete meals from the menu. 
Reply in ${langMap[lang] || "English"}.
Be warm, enthusiastic, and brief. Use emojis sparingly.
Format your response as a structured meal suggestion with clear sections.

CRITICAL REQUIREMENT - YOU MUST FOLLOW THIS EXACTLY:
The very last line of your response MUST be exactly in this format:
ITEMS:1:2,3:1,5:1
Where each entry is menuItemID:quantity separated by commas.
Do NOT wrap it in markdown. Do NOT add any text after it. Do NOT forget this line.
This line is parsed by code and the feature breaks without it.`;

    const userPrompt = `Here is our menu:
${menuSummary}

Suggest a complete, balanced Afghan meal for ${guests} ${guests === 1 ? "person" : "people"} for today. 
Include:
- A main dish (1 per person, can vary)
- An appetizer/side to share
- A drink for each person
- Total estimated price

Keep it short and appetizing. Show dish names and prices clearly.

YOUR FINAL LINE MUST BE (no markdown, no backticks, just plain text):
ITEMS:id:qty,id:qty,id:qty
Example: ITEMS:1:1,2:1,8:1
This is mandatory and must be the absolute last line.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests, please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please try again later." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const fullText = data.choices?.[0]?.message?.content ?? "Could not generate a suggestion.";

    // Parse out the ITEMS: line
    const lines = fullText.split("\n");
    const itemsLineIdx = lines.findIndex((l: string) => l.trim().startsWith("ITEMS:"));
    let suggestion = fullText;
    let suggestedItems: { id: number; quantity: number; name: Record<string, string>; price: number; image: string }[] = [];

    if (itemsLineIdx !== -1) {
      // Remove the ITEMS: line from the displayed suggestion
      suggestion = lines.slice(0, itemsLineIdx).join("\n").trim();
      const itemsPart = lines[itemsLineIdx].trim().replace("ITEMS:", "").trim();
      const pairs = itemsPart.split(",").map((p: string) => p.trim()).filter(Boolean);

      for (const pair of pairs) {
        const [idStr, qtyStr] = pair.split(":");
        const id = parseInt(idStr, 10);
        const qty = parseInt(qtyStr || "1", 10);
        const menuItem = items.find((i) => i.id === id);
        if (menuItem) {
          suggestedItems.push({
            id: menuItem.id,
            quantity: qty,
            name: { nl: menuItem.name_nl, en: menuItem.name_en, da: menuItem.name_da },
            price: menuItem.price,
            image: menuItem.image_url || "",
          });
        }
      }
    }

    return new Response(JSON.stringify({ suggestion, suggestedItems }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("suggest-meal error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

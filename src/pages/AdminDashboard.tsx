import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Package, Clock, CheckCircle, Truck, DollarSign, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  preparing: "bg-orange-500/20 text-orange-400",
  delivering: "bg-blue-500/20 text-blue-400",
  delivered: "bg-green-500/20 text-green-400",
  completed: "bg-green-500/20 text-green-400",
};

const AdminDashboard = () => {
  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*, menu_items(name_en))")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    refetchInterval: 15000,
  });

  const totalRevenue = orders?.reduce((sum: number, o: any) => sum + Number(o.total_price), 0) || 0;
  const todayOrders = orders?.filter((o: any) => {
    const d = new Date(o.created_at);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }) || [];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground font-body text-sm mb-8">Ariana Tech — Order Management</p>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="glass-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">{orders?.length || 0}</p>
                <p className="text-xs text-muted-foreground font-body">Total Orders</p>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">€{totalRevenue.toFixed(2).replace(".", ",")}</p>
                <p className="text-xs text-muted-foreground font-body">Total Revenue</p>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">{todayOrders.length}</p>
                <p className="text-xs text-muted-foreground font-body">Today's Orders</p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        {isLoading ? (
          <div className="glass-card rounded-xl border border-border p-8 animate-pulse h-64" />
        ) : (
          <div className="glass-card rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders?.map((order: any, idx: number) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.02 }}
                    className="border-b border-border hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="font-body text-sm text-muted-foreground whitespace-nowrap">
                      {new Date(order.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </TableCell>
                    <TableCell className="font-body text-sm font-medium text-foreground">{order.customer_name}</TableCell>
                    <TableCell className="font-body text-sm text-muted-foreground">{order.customer_phone}</TableCell>
                    <TableCell className="font-body text-xs text-muted-foreground max-w-[200px]">
                      {order.order_items?.map((i: any) => `${i.quantity}x ${i.menu_items?.name_en || "?"}`).join(", ")}
                    </TableCell>
                    <TableCell className="font-body text-sm">
                      <span className="text-xs">{order.order_type === "delivery" ? "🚲" : "🏪"}</span> {order.order_type}
                    </TableCell>
                    <TableCell className="font-body text-sm">
                      {order.payment_method === "crypto" ? "₿ Crypto" : "💵 Cash"}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-body font-medium ${statusColors[order.status] || "bg-muted text-muted-foreground"}`}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-display font-bold text-foreground">
                      €{Number(order.total_price).toFixed(2).replace(".", ",")}
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

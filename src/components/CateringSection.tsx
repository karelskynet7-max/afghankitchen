import { useState } from "react";
import { motion } from "framer-motion";
import { Users, FileText, ChefHat, CalendarClock, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import { useSubmitCateringRequest } from "@/hooks/useCateringRequest";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import cateringImg from "@/assets/catering-buffet.jpg";

const CateringSection = () => {
  const { t, lang, dir } = useI18n();
  const [formOpen, setFormOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const submitRequest = useSubmitCateringRequest();
  const [form, setForm] = useState({
    companyName: "", contactName: "", email: "", phone: "",
    guestCount: 10, eventDate: "", eventType: "", message: "",
    dietaryRequirements: [] as string[],
  });

  const features = [
    { icon: Users, text: t("catering.minOrder") },
    { icon: FileText, text: t("catering.vat") },
    { icon: ChefHat, text: t("catering.custom") },
    { icon: CalendarClock, text: t("catering.weekly") },
  ];

  const labels = {
    company: { nl: "Bedrijfsnaam", en: "Company name", da: "نام شرکت" },
    contact: { nl: "Contactpersoon", en: "Contact person", da: "شخص تماس" },
    email: { nl: "E-mail", en: "Email", da: "ایمیل" },
    phone: { nl: "Telefoon", en: "Phone", da: "تلفن" },
    guests: { nl: "Aantal gasten", en: "Number of guests", da: "تعداد مهمان" },
    date: { nl: "Datum evenement", en: "Event date", da: "تاریخ مراسم" },
    type: { nl: "Type evenement", en: "Event type", da: "نوع مراسم" },
    message: { nl: "Bericht", en: "Message", da: "پیام" },
    submit: { nl: "Offerte Aanvragen", en: "Request Quote", da: "درخواست قیمت" },
    success: { nl: "Aanvraag verzonden! 🎉", en: "Request sent! 🎉", da: "!درخواست ارسال شد 🎉" },
    successDesc: { nl: "We nemen binnen 24 uur contact op.", en: "We'll contact you within 24 hours.", da: ".ظرف ۲۴ ساعت با شما تماس می‌گیریم" },
  };

  const l = (key: keyof typeof labels) => labels[key][lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitRequest.mutateAsync(form);
      setSuccess(true);
      setTimeout(() => { setFormOpen(false); setSuccess(false); }, 3000);
    } catch (err) {
      console.error("Catering request failed:", err);
    }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border font-body text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors";

  return (
    <>
      <section id="catering" className="py-20 md:py-28 bg-muted/30" dir={dir}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden aspect-[4/3]">
              <img src={cateringImg} alt="Afghan catering buffet" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-lapis-gradient font-body text-sm font-semibold uppercase tracking-[0.2em] mb-3 block">{t("catering.label")}</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">{t("catering.title")}</h2>
              <p className="text-muted-foreground font-body mb-8 leading-relaxed">{t("catering.desc")}</p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {features.map((feat, i) => (
                  <div key={i} className="glass-card rounded-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <feat.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-body text-sm text-foreground font-medium">{feat.text}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setFormOpen(true)} className="btn-gold px-8 py-3.5 rounded-xl font-body text-sm flex items-center gap-2 group">
                {t("catering.cta")}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto" dir={dir}>
          {success ? (
            <div className="flex flex-col items-center justify-center py-10 gap-4">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                <CheckCircle className="w-16 h-16 text-primary" />
              </motion.div>
              <h3 className="font-display text-2xl font-bold text-foreground">{l("success")}</h3>
              <p className="text-muted-foreground font-body">{l("successDesc")}</p>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-xl">{t("catering.cta")}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-sm text-muted-foreground block mb-1">{l("company")} *</label>
                    <input required value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className="font-body text-sm text-muted-foreground block mb-1">{l("contact")} *</label>
                    <input required value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} className={inputClass} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-sm text-muted-foreground block mb-1">{l("email")} *</label>
                    <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className="font-body text-sm text-muted-foreground block mb-1">{l("phone")} *</label>
                    <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-sm text-muted-foreground block mb-1">{l("guests")} *</label>
                    <input required type="number" min={10} value={form.guestCount} onChange={(e) => setForm({ ...form, guestCount: Number(e.target.value) })} className={inputClass} />
                  </div>
                  <div>
                    <label className="font-body text-sm text-muted-foreground block mb-1">{l("date")} *</label>
                    <input required type="date" value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="font-body text-sm text-muted-foreground block mb-1">{l("type")}</label>
                  <input value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="font-body text-sm text-muted-foreground block mb-1">{l("message")}</label>
                  <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={3} className={`${inputClass} resize-none`} />
                </div>
                <button type="submit" disabled={submitRequest.isPending}
                  className="w-full btn-gold py-3 rounded-xl font-body text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
                  {submitRequest.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {l("submit")}
                </button>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CateringSection;

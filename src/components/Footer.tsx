import { useI18n } from "@/hooks/useI18n";

const Footer = () => {
  const { t, dir } = useI18n();

  return (
    <footer id="about" className="border-t border-border py-10" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-gold-gradient font-display text-xl font-bold">Ariana</span>
          <span className="text-muted-foreground font-body text-xs uppercase tracking-[0.2em]">Tech</span>
        </div>
        <div className="flex items-center gap-6 text-muted-foreground font-body text-sm">
          <span>Amsterdam</span>
          <span>Rotterdam</span>
          <span>Utrecht</span>
          <span>Den Haag</span>
        </div>
        <p className="text-muted-foreground font-body text-xs">
          © 2026 Ariana Tech. {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
};

export default Footer;

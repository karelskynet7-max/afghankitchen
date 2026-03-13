import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Sparkles } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

const DISMISSED_KEY = "ariana_spin_wheel_dismissed";

const SEGMENTS = [
  { label: "5%", value: 5, color: "hsl(215 65% 42%)" },
  { label: "10%", value: 10, color: "hsl(45 80% 55%)" },
  { label: "15%", value: 15, color: "hsl(215 55% 55%)" },
  { label: "5%", value: 5, color: "hsl(35 90% 55%)" },
  { label: "10%", value: 10, color: "hsl(45 70% 70%)" },
  { label: "15%", value: 15, color: "hsl(215 65% 42%)" },
];

const labels = {
  nl: {
    title: "Draai & Win! 🎰",
    subtitle: "Win tot 15% korting op je bestelling",
    spin: "Draai het wiel",
    won: "Je hebt gewonnen!",
    discount: (v: number) => `${v}% korting`,
    code: (v: number) => `SPIN${v}`,
    useCode: "Gebruik code bij checkout",
    close: "Sluiten",
  },
  en: {
    title: "Spin & Win! 🎰",
    subtitle: "Win up to 15% off your order",
    spin: "Spin the wheel",
    won: "You won!",
    discount: (v: number) => `${v}% off`,
    code: (v: number) => `SPIN${v}`,
    useCode: "Use code at checkout",
    close: "Close",
  },
  da: {
    title: "!بچرخان و ببر 🎰",
    subtitle: "تا ۱۵٪ تخفیف در سفارش خود ببرید",
    spin: "چرخ را بچرخانید",
    won: "!شما برنده شدید",
    discount: (v: number) => `${v}% تخفیف`,
    code: (v: number) => `SPIN${v}`,
    useCode: "کد را در پرداخت استفاده کنید",
    close: "بستن",
  },
};

const SpinWheelPopup = () => {
  const [show, setShow] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { lang } = useI18n();
  const l = labels[lang] || labels.en;

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISSED_KEY);
    if (dismissed) return;
    const timer = setTimeout(() => setShow(true), 12000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 4;
    const segAngle = (2 * Math.PI) / SEGMENTS.length;

    ctx.clearRect(0, 0, size, size);

    SEGMENTS.forEach((seg, i) => {
      const start = i * segAngle;
      const end = start + segAngle;

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, start, end);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();
      ctx.strokeStyle = "hsl(222 30% 6%)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(start + segAngle / 2);
      ctx.textAlign = "center";
      ctx.fillStyle = "#fff";
      ctx.font = "bold 18px Inter, sans-serif";
      ctx.fillText(seg.label, radius * 0.6, 6);
      ctx.restore();
    });

    // Center circle
    ctx.beginPath();
    ctx.arc(center, center, 20, 0, 2 * Math.PI);
    ctx.fillStyle = "hsl(222 25% 10%)";
    ctx.fill();
    ctx.strokeStyle = "hsl(45 80% 55%)";
    ctx.lineWidth = 3;
    ctx.stroke();
  }, [show]);

  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);

    const winIndex = Math.floor(Math.random() * SEGMENTS.length);
    const segAngle = 360 / SEGMENTS.length;
    const targetAngle = 360 - (winIndex * segAngle + segAngle / 2);
    const spins = 5;
    const finalRotation = rotation + spins * 360 + targetAngle;

    setRotation(finalRotation);

    setTimeout(() => {
      setResult(SEGMENTS[winIndex].value);
      setSpinning(false);
    }, 4000);
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem(DISMISSED_KEY, "true");
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/70 backdrop-blur-sm"
          onClick={handleDismiss}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 22 }}
            className="relative w-full max-w-sm glass-card border border-border rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 z-10 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="font-display text-2xl font-bold text-foreground">{l.title}</h2>
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <p className="font-body text-sm text-muted-foreground mb-5">{l.subtitle}</p>

              {result === null ? (
                <>
                  {/* Wheel */}
                  <div className="relative w-56 h-56 mx-auto mb-5">
                    {/* Pointer */}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-10 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[20px] border-l-transparent border-r-transparent border-t-primary" />
                    <motion.div
                      animate={{ rotate: rotation }}
                      transition={{ duration: 4, ease: [0.17, 0.67, 0.12, 0.99] }}
                      className="w-full h-full"
                    >
                      <canvas ref={canvasRef} width={224} height={224} className="w-full h-full" />
                    </motion.div>
                  </div>

                  <button
                    onClick={handleSpin}
                    disabled={spinning}
                    className="btn-gold w-full px-6 py-3 rounded-xl font-body text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Gift className="w-4 h-4" />
                    {l.spin}
                  </button>
                </>
              ) : (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 15 }}
                >
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-1">{l.won}</h3>
                  <p className="font-display text-3xl font-bold text-primary mb-3">{l.discount(result)}</p>
                  <div className="bg-muted rounded-lg px-4 py-2 border border-border inline-block mb-2">
                    <span className="font-display text-lg font-bold text-primary tracking-wider">{l.code(result)}</span>
                  </div>
                  <p className="font-body text-xs text-muted-foreground mb-4">{l.useCode}</p>
                  <button
                    onClick={handleDismiss}
                    className="btn-gold w-full px-6 py-3 rounded-xl font-body text-sm font-semibold"
                  >
                    {l.close}
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SpinWheelPopup;

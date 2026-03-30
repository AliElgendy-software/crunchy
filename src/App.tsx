import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShoppingCart, 
  UtensilsCrossed, 
  Egg, 
  Utensils, 
  Phone, 
  MapPin, 
  Globe, 
  Mail, 
  ShoppingBasket,
  Search,
  ChevronLeft,
  Star,
  Flame,
  Clock,
  Info,
  ArrowRight,
  Menu,
  X,
  Plus,
  Minus,
  Trash2,
  Send
} from "lucide-react";
import { Toaster, toast } from "sonner";
import { cn } from "@/src/lib/utils";
import { MENU_DATA } from "./data";

interface CartItem {
  id: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
}

const CATEGORIES = [
  { id: "crepes", name: "كريب", icon: <UtensilsCrossed className="w-4 h-4" /> },
  { id: "mixes", name: "ميكسات", icon: <Star className="w-4 h-4" /> },
  { id: "burgers", name: "برجر", icon: <Egg className="w-4 h-4" /> },
  { id: "pizza", name: "بيتزا", icon: <Utensils className="w-4 h-4" /> },
  { id: "negresco", name: "نجرسكو", icon: <Flame className="w-4 h-4" /> },
  { id: "extras", name: "إضافات", icon: <Info className="w-4 h-4" /> },
];

const Navbar = ({ cartCount, onCartClick }: { cartCount: number, onCartClick: () => void }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-500 px-6 py-4 flex justify-between items-center",
      scrolled ? "bg-black/80 backdrop-blur-2xl border-b border-white/5 py-3" : "bg-transparent"
    )}>
      <div className="flex items-center gap-8">
        <span className="text-2xl font-black italic text-primary font-headline tracking-tighter">CRUNCHY</span>
        <div className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-white/60">
          <a href="#crepes" className="hover:text-primary transition-colors">Menu</a>
          <a href="#footer" className="hover:text-primary transition-colors">Contact</a>
          <a href="#footer" className="hover:text-primary transition-colors">Location</a>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
          <Phone className="w-3 h-3 text-primary" />
          <span className="text-[10px] font-black text-white/80">01118280661</span>
        </div>
        <button 
          onClick={onCartClick}
          className="relative p-2.5 bg-primary text-white rounded-full shadow-lg shadow-primary/20 hover:scale-110 active:scale-95 transition-all"
        >
          <ShoppingCart className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-white text-primary text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};

const Hero = () => (
  <section className="relative min-h-screen flex flex-col justify-center items-center px-6 overflow-hidden">
    {/* Cinematic Background */}
    <div className="absolute inset-0 z-0">
      <img 
        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80" 
        alt="Food Spread" 
        className="w-full h-full object-cover opacity-40 scale-105"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black"></div>
      <div className="absolute inset-0 mesh-gradient opacity-30"></div>
    </div>
    
    <div className="relative z-10 text-center max-w-6xl mx-auto pt-20">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="flex justify-center mb-8">
          <span className="px-6 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-primary text-[10px] font-black uppercase tracking-[0.5em] shadow-2xl">
            Crunchy • Dimensional Gastronomy
          </span>
        </div>
        
        <h1 className="relative">
          <span className="block text-[12vw] md:text-[160px] font-black font-headline leading-[0.75] tracking-tighter text-white uppercase italic mix-blend-difference">
            TASTE THE
          </span>
          <span className="block text-[15vw] md:text-[200px] font-black font-headline leading-[0.75] tracking-tighter text-primary uppercase italic text-glow -mt-4 md:-mt-8">
            CRUNCH
          </span>
        </h1>

        <div className="mt-12 max-w-2xl mx-auto">
          <p className="text-xl md:text-2xl text-white/70 font-bold leading-relaxed mb-12">
            نقدم لك تجربة طعام استثنائية تجمع بين القرمشة الحقيقية والمذاق الإيطالي الأصيل في قلب العزيزية.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="w-full sm:w-auto bg-primary text-white px-14 py-6 rounded-full font-black text-xl shadow-[0_20px_50px_rgba(186,0,39,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 group">
              اطلب الآن
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
            <button className="w-full sm:w-auto bg-white/5 backdrop-blur-2xl border border-white/10 text-white px-14 py-6 rounded-full font-black text-xl hover:bg-white/10 transition-all">
              تصفح المنيو
            </button>
          </div>
        </div>
      </motion.div>
    </div>

    {/* Floating Category Previews */}
    <div className="absolute bottom-12 left-0 w-full z-20 px-6 hidden lg:block">
      <div className="max-w-6xl mx-auto flex justify-between items-end">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="flex gap-8"
        >
          <div className="group cursor-pointer">
            <span className="block text-[10px] font-black text-primary uppercase tracking-widest mb-2">01</span>
            <h4 className="text-xl font-black italic group-hover:text-primary transition-colors">البرجر المشوي</h4>
          </div>
          <div className="group cursor-pointer">
            <span className="block text-[10px] font-black text-primary uppercase tracking-widest mb-2">02</span>
            <h4 className="text-xl font-black italic group-hover:text-primary transition-colors">البيتزا الإيطالية</h4>
          </div>
          <div className="group cursor-pointer">
            <span className="block text-[10px] font-black text-primary uppercase tracking-widest mb-2">03</span>
            <h4 className="text-xl font-black italic group-hover:text-primary transition-colors">الكريب المقرمش</h4>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
          className="flex flex-col items-center gap-4"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 vertical-text">Scroll to Explore</span>
          <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent"></div>
        </motion.div>
      </div>
    </div>
  </section>
);

const CategoryBar = ({ activeCategory, setActiveCategory }: { activeCategory: string, setActiveCategory: (id: string) => void }) => {
  const scrollToCategory = (id: string) => {
    setActiveCategory(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <div className="sticky top-0 z-40 bg-black/60 backdrop-blur-2xl border-b border-white/5 py-4 overflow-hidden">
      <div className="flex items-center gap-3 px-6 overflow-x-auto no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => scrollToCategory(cat.id)}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-full whitespace-nowrap text-xs font-black uppercase tracking-widest transition-all duration-500",
              activeCategory === cat.id 
                ? "bg-primary text-white shadow-xl shadow-primary/30 scale-105" 
                : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
            )}
          >
            {cat.icon}
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
};

const SectionHeader = ({ title, subtitle, id }: { title: string, subtitle?: string, id: string }) => (
  <div id={id} className="mb-12 pt-12">
    <div className="flex items-center gap-4 mb-4">
      <div className="h-12 w-2 bg-primary rounded-full shadow-[0_0_20px_rgba(186,0,39,0.5)]"></div>
      <h2 className="text-4xl md:text-5xl font-black text-white font-headline tracking-tighter uppercase italic">{title}</h2>
    </div>
    {subtitle && <p className="text-sm text-white/40 font-bold pr-6 uppercase tracking-widest">{subtitle}</p>}
  </div>
);

const PriceBadge = ({ label, price, highlight = false, onClick }: { label: string, price: number | string, highlight?: boolean, onClick?: () => void }) => (
  <button 
    onClick={(e) => {
      e.stopPropagation();
      onClick?.();
    }}
    className={cn(
      "flex flex-col items-center justify-center px-5 py-3 rounded-2xl min-w-[85px] transition-all duration-300 active:scale-90",
      highlight ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105 hover:bg-primary/90" : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
    )}
  >
    <span className={cn("text-[10px] font-black uppercase mb-1 tracking-widest", highlight ? "text-white/80" : "text-white/30")}>{label}</span>
    <span className="text-base font-black">{price}</span>
  </button>
);

export default function App() {
  const [activeCategory, setActiveCategory] = useState("crepes");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: "", phone: "", address: "" });

  const totalItems = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);
  const totalPrice = useMemo(() => cart.reduce((acc, item) => acc + (item.price * item.quantity), 0), [cart]);

  const addToCart = (item: any, size: string, price: number) => {
    const cartId = `${item.name}-${size}`;
    setCart(prev => {
      const existing = prev.find(i => i.id === cartId);
      if (existing) {
        return prev.map(i => i.id === cartId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: cartId, name: item.name, price, size, quantity: 1 }];
    });
    toast.success(`تم إضافة ${item.name} (${size}) إلى السلة`);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const sendOrder = () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      toast.error("يرجى إكمال بيانات التوصيل");
      return;
    }
    
    const orderText = cart.map(item => `- ${item.name} (${item.size}) x${item.quantity} = ${item.price * item.quantity} ج.م`).join("\n");
    const message = `طلب جديد من Crunchy:\n\nالاسم: ${customerInfo.name}\nالهاتف: ${customerInfo.phone}\nالعنوان: ${customerInfo.address}\n\nالطلبات:\n${orderText}\n\nالإجمالي: ${totalPrice} ج.م`;
    
    const whatsappUrl = `https://wa.me/201118280661?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    toast.success("تم تجهيز الطلب! سيتم توجيهك إلى واتساب");
    setCart([]);
    setIsCartOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = CATEGORIES.map(cat => document.getElementById(cat.id));
      const scrollPosition = window.scrollY + 200;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveCategory(CATEGORIES[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-white font-body dir-rtl" dir="rtl">
      <Toaster position="top-center" richColors />
      <Navbar cartCount={totalItems} onCartClick={() => setIsCartOpen(true)} />
      <Hero />
      
      <div className="relative z-10 bg-black">
        <CategoryBar activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

        <div className="px-6 max-w-7xl mx-auto pb-40">
          
          {/* Crepe Corner */}
          <section>
            <SectionHeader 
              id="crepes" 
              title="ركن الكريب" 
              subtitle="Individual Masterpieces (S - M - L - Extra - Roll)" 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MENU_DATA.crepeCorner.map((item, i) => (
                <div key={i} className="glass-card p-7 rounded-[2rem] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 group hover:bg-white/5 transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-2 h-2 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></div>
                    <span className="text-xl font-black text-white/80 group-hover:text-white transition-colors">{item.name}</span>
                  </div>
                  <div className="flex gap-2 flex-wrap justify-end">
                    <button onClick={() => addToCart(item, "S", item.prices.s)} className="text-xs font-black bg-white/5 px-3 py-2 rounded-xl text-white/40 hover:bg-white/10 transition-colors">S: {item.prices.s}</button>
                    <button onClick={() => addToCart(item, "M", item.prices.m)} className="text-xs font-black bg-white/5 px-3 py-2 rounded-xl text-white/40 hover:bg-white/10 transition-colors">M: {item.prices.m}</button>
                    <button onClick={() => addToCart(item, "L", item.prices.l)} className="text-xs font-black bg-primary/10 px-3 py-2 rounded-xl text-primary/60 hover:bg-primary/20 transition-colors">L: {item.prices.l}</button>
                    <button onClick={() => addToCart(item, "E", item.prices.extra)} className="text-xs font-black bg-primary/20 px-3 py-2 rounded-xl text-primary hover:bg-primary/30 transition-colors">E: {item.prices.extra}</button>
                    <button onClick={() => addToCart(item, "R", item.prices.roll)} className="text-xs font-black bg-white/10 px-3 py-2 rounded-xl text-white/60 hover:bg-white/20 transition-colors">R: {item.prices.roll}</button>
                  </div>
                </div>
              ))}
            </div>

            <h4 className="text-2xl font-black text-primary mt-20 mb-10 flex items-center gap-4 italic uppercase tracking-widest">
              <UtensilsCrossed className="w-6 h-6" /> Mixes Corner
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MENU_DATA.mixesCorner.map((item, i) => (
                <div key={i} className="glass-card p-7 rounded-[2rem] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 group hover:bg-white/5 transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-2 h-2 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></div>
                    <span className="text-xl font-black text-white/80 group-hover:text-white transition-colors">{item.name}</span>
                  </div>
                  <div className="flex gap-2 flex-wrap justify-end">
                    <button onClick={() => addToCart(item, "S", item.prices.s)} className="text-xs font-black bg-white/5 px-3 py-2 rounded-xl text-white/40 hover:bg-white/10 transition-colors">S: {item.prices.s}</button>
                    <button onClick={() => addToCart(item, "M", item.prices.m)} className="text-xs font-black bg-white/5 px-3 py-2 rounded-xl text-white/40 hover:bg-white/10 transition-colors">M: {item.prices.m}</button>
                    <button onClick={() => addToCart(item, "L", item.prices.l)} className="text-xs font-black bg-primary/10 px-3 py-2 rounded-xl text-primary/60 hover:bg-primary/20 transition-colors">L: {item.prices.l}</button>
                    <button onClick={() => addToCart(item, "E", item.prices.extra)} className="text-xs font-black bg-primary/20 px-3 py-2 rounded-xl text-primary hover:bg-primary/30 transition-colors">E: {item.prices.extra}</button>
                    <button onClick={() => addToCart(item, "R", item.prices.roll)} className="text-xs font-black bg-white/10 px-3 py-2 rounded-xl text-white/60 hover:bg-white/20 transition-colors">R: {item.prices.roll}</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Mixes Section */}
          <section className="mt-24">
            <SectionHeader 
              id="mixes" 
              title="ميكسات ع كيفك" 
              subtitle="The Ultimate Signature Blends" 
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {MENU_DATA.crepeMixes.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="glass-card p-10 rounded-[3rem] flex flex-col gap-8 group hover:border-primary/30 transition-all duration-500"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-3xl font-black text-white mb-3 group-hover:text-primary transition-colors">كريب {item.name}</h3>
                      <p className="text-base text-white/40 font-bold leading-relaxed">{item.description}</p>
                    </div>
                    <div className="bg-primary/20 text-primary p-4 rounded-2xl">
                      <Star className="w-8 h-8 fill-current" />
                    </div>
                  </div>
                  <div className="flex gap-4 justify-end mt-auto flex-wrap">
                    <PriceBadge label="كبير" price={item.prices.large} highlight onClick={() => addToCart(item, "كبير", item.prices.large)} />
                    <PriceBadge label="إكسترا" price={item.prices.extra} onClick={() => addToCart(item, "إكسترا", item.prices.extra)} />
                    <PriceBadge label="رول" price={item.prices.roll} onClick={() => addToCart(item, "رول", item.prices.roll)} />
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Burgers Section */}
          <section className="mt-24">
            <SectionHeader 
              id="burgers" 
              title="ركن البرجر" 
              subtitle="Flame-Grilled Perfection" 
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <h4 className="text-2xl font-black text-primary mb-10 flex items-center gap-4 italic uppercase tracking-widest">
                  <Flame className="w-6 h-6" /> Chicken Selection
                </h4>
                <div className="grid gap-6">
                  {MENU_DATA.chickenBurgers.map((item, i) => (
                    <div key={i} className="glass-card p-8 rounded-[2rem] flex justify-between items-center group">
                      <span className="text-xl font-black text-white/90">{item.name}</span>
                      <div className="flex gap-4">
                        <PriceBadge label="Single" price={item.prices.single} onClick={() => addToCart(item, "Single", item.prices.single)} />
                        <PriceBadge label="Double" price={item.prices.double} highlight onClick={() => addToCart(item, "Double", item.prices.double)} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <h4 className="text-2xl font-black text-primary mb-10 flex items-center gap-4 italic uppercase tracking-widest">
                  <Utensils className="w-6 h-6" /> Beef Selection
                </h4>
                <div className="grid gap-6">
                  {MENU_DATA.beefBurgers.map((item, i) => (
                    <div key={i} className="glass-card p-8 rounded-[2rem] flex justify-between items-center group">
                      <span className="text-xl font-black text-white/90">{item.name}</span>
                      <div className="flex gap-4">
                        <PriceBadge label="Single" price={item.prices.single} onClick={() => addToCart(item, "Single", item.prices.single)} />
                        <PriceBadge label="Double" price={item.prices.double} highlight onClick={() => addToCart(item, "Double", item.prices.double)} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Pizza Section */}
          <section className="mt-24">
            <SectionHeader 
              id="pizza" 
              title="ركن البيتزا" 
              subtitle="Authentic Italian Heritage (S - M - L - XL)" 
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {MENU_DATA.pizza.map((item, i) => (
                <div key={i} className="glass-card p-8 rounded-[2rem] flex flex-col justify-between gap-8 group hover:border-primary/40 transition-all">
                  <div className="flex justify-between items-start">
                    <span className="font-black text-2xl text-white/90 group-hover:text-primary transition-colors">{item.name}</span>
                    <Clock className="w-5 h-5 text-white/20 group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex gap-2 flex-wrap justify-end">
                    <button onClick={() => addToCart(item, "S", item.prices.s)} className="text-xs font-black bg-white/5 px-3 py-2 rounded-xl text-white/40 hover:bg-white/10 transition-colors">S: {item.prices.s}</button>
                    <button onClick={() => addToCart(item, "M", item.prices.m)} className="text-xs font-black bg-white/5 px-3 py-2 rounded-xl text-white/40 hover:bg-white/10 transition-colors">M: {item.prices.m}</button>
                    <button onClick={() => addToCart(item, "L", item.prices.l)} className="text-xs font-black bg-primary/10 px-3 py-2 rounded-xl text-primary/60 hover:bg-primary/20 transition-colors">L: {item.prices.l}</button>
                    <button onClick={() => addToCart(item, "XL", item.prices.xl)} className="text-xs font-black bg-primary/20 px-3 py-2 rounded-xl text-primary hover:bg-primary/30 transition-colors">XL: {item.prices.xl}</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Negresco Section */}
          <section className="mt-24">
            <SectionHeader 
              id="negresco" 
              title="ركن النجرسكو" 
              subtitle="Creamy Pasta Masterpieces" 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MENU_DATA.negresco.map((item, i) => (
                <div key={i} className="glass-card p-8 rounded-[2.5rem] flex flex-col gap-6 group">
                  <h3 className="text-2xl font-black text-white group-hover:text-primary transition-colors">نجرسكو {item.name}</h3>
                  <div className="flex gap-3 justify-end">
                    <PriceBadge label="Medium" price={item.prices.m} onClick={() => addToCart(item, "Medium", item.prices.m)} />
                    <PriceBadge label="Large" price={item.prices.l} highlight onClick={() => addToCart(item, "Large", item.prices.l)} />
                    <PriceBadge label="X-Large" price={item.prices.xl} onClick={() => addToCart(item, "X-Large", item.prices.xl)} />
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>

      {/* Footer */}
      <footer id="footer" className="bg-zinc-950 border-t border-white/5 pt-24 pb-12 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-24">
            <div className="space-y-8">
              <span className="text-4xl font-black italic text-primary font-headline tracking-tighter">CRUNCHY</span>
              <p className="text-white/40 font-bold leading-relaxed">
                نحن نؤمن بأن الطعام هو لغة السعادة، ولذلك نقدم لك أفضل المكونات مع لمسة إبداعية تجعل من كل وجبة ذكرى لا تنسى.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                  <Mail className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h5 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Contact Us</h5>
              <div className="space-y-4">
                {[
                  { number: "01118280661", label: "للطلب والاستفسار" },
                  { number: "01026500505", label: "الشكاوي والاقتراحات" },
                  { number: "01272616964", label: "للطلب والاستفسار" }
                ].map((item, i) => (
                  <a key={i} href={`tel:${item.number}`} className="flex items-center gap-4 text-white/60 hover:text-white transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Phone className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-lg tracking-widest">{item.number}</span>
                      <span className="text-[10px] font-bold text-white/30 uppercase tracking-wider">{item.label}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <h5 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Location</h5>
              <div className="flex items-start gap-4 text-white/60">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <p className="font-black text-lg leading-snug">العزيزية - أمام الكوبري الجديد</p>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start gap-2">
              <p className="text-sm font-black text-primary/60 uppercase tracking-[0.2em] italic">
                Developed by Ali Elgendy
              </p>
            </div>
            <div className="flex gap-8 text-[10px] font-black text-white/20 uppercase tracking-widest">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-8 left-8 bg-primary text-white w-16 h-16 rounded-full shadow-[0_20px_50px_rgba(186,0,39,0.4)] flex items-center justify-center z-50 hover:scale-110 active:scale-95 transition-all group"
      >
        <ShoppingBasket className="w-8 h-8 group-hover:rotate-12 transition-transform" />
        {totalItems > 0 && (
          <div className="absolute -top-1 -right-1 bg-white text-primary text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-black">
            {totalItems}
          </div>
        )}
      </button>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="fixed top-0 left-0 h-full w-full max-w-md bg-zinc-950 border-r border-white/5 z-[70] flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h2 className="text-2xl font-black italic text-primary">سلة المشتريات</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-white/20 gap-4">
                    <ShoppingBasket className="w-20 h-20" />
                    <p className="font-black text-xl">السلة فارغة</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div key={item.id} className="glass-card p-4 rounded-2xl flex justify-between items-center gap-4">
                          <div className="flex-1">
                            <h4 className="font-black text-white/90">{item.name}</h4>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest">{item.size} • {item.price} ج.م</p>
                          </div>
                          <div className="flex items-center gap-3 bg-white/5 p-1 rounded-xl">
                            <button onClick={() => updateQuantity(item.id, -1)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-black w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-primary">
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <button onClick={() => updateQuantity(item.id, -item.quantity)} className="p-2 text-white/20 hover:text-primary transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="pt-6 border-t border-white/5 space-y-4">
                      <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary">بيانات التوصيل</h3>
                      <div className="space-y-3">
                        <input 
                          type="text" 
                          placeholder="الاسم بالكامل"
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                        />
                        <input 
                          type="tel" 
                          placeholder="رقم الهاتف"
                          value={customerInfo.phone}
                          onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                        />
                        <textarea 
                          placeholder="عنوان التوصيل بالتفصيل"
                          value={customerInfo.address}
                          onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors h-24 resize-none"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-white/5 bg-black/40 backdrop-blur-xl">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-white/40 font-bold">الإجمالي</span>
                    <span className="text-2xl font-black text-primary">{totalPrice} ج.م</span>
                  </div>
                  <button 
                    onClick={sendOrder}
                    className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    تأكيد الطلب عبر واتساب
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import {
  Search, ShoppingCart, Menu, X, ChevronRight,
  Star, Zap, Sparkles, TrendingUp, Heart,
  Eye, Box, Layers, Cpu, Flame, Gift, Crown,
  Rocket, Bolt, Shield, Award
} from 'lucide-react';
import { ParticleField } from './components/ParticleField';
import { MagneticButton } from './components/MagneticButton';
import { LiquidBlob } from './components/LiquidBlob';
import { RippleEffect } from './components/RippleEffect';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  rating: number;
  image: string;
  color: string;
  glow: string;
  icon: any;
  featured?: boolean;
  tag?: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "QuantumPulse Pro",
    price: 207417,
    category: "Wearables",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    color: "from-cyan-500 to-blue-600",
    glow: "shadow-[0_0_50px_rgba(6,182,212,0.5)]",
    icon: Cpu,
    featured: true,
    tag: "BESTSELLER"
  },
  {
    id: 2,
    name: "NeoGlide X-Series",
    price: 157617,
    category: "Audio",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    color: "from-purple-500 to-pink-600",
    glow: "shadow-[0_0_50px_rgba(168,85,247,0.5)]",
    icon: Zap,
    featured: true,
    tag: "NEW"
  },
  {
    id: 3,
    name: "HyperVision Elite",
    price: 273817,
    category: "Display",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500",
    color: "from-orange-500 to-red-600",
    glow: "shadow-[0_0_50px_rgba(249,115,22,0.5)]",
    icon: Eye,
    featured: true,
    tag: "PREMIUM"
  },
  {
    id: 4,
    name: "AetherCore Mini",
    price: 74617,
    category: "Computing",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500",
    color: "from-emerald-500 to-teal-600",
    glow: "shadow-[0_0_50px_rgba(16,185,129,0.5)]",
    icon: Box
  },
  {
    id: 5,
    name: "Stellar Sync Pod",
    price: 49717,
    category: "Accessories",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500",
    color: "from-yellow-500 to-orange-600",
    glow: "shadow-[0_0_50px_rgba(234,179,8,0.5)]",
    icon: Sparkles
  },
  {
    id: 6,
    name: "InfinityWave Set",
    price: 107817,
    category: "Audio",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500",
    color: "from-indigo-500 to-purple-600",
    glow: "shadow-[0_0_50px_rgba(99,102,241,0.5)]",
    icon: Layers
  },
  {
    id: 7,
    name: "FluxDrive Ultra",
    price: 66317,
    category: "Storage",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
    color: "from-rose-500 to-pink-600",
    glow: "shadow-[0_0_50px_rgba(244,63,94,0.5)]",
    icon: Flame
  },
  {
    id: 8,
    name: "VortexBeam Alpha",
    price: 149317,
    category: "Display",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=500",
    color: "from-sky-500 to-cyan-600",
    glow: "shadow-[0_0_50px_rgba(14,165,233,0.5)]",
    icon: TrendingUp
  }
];

const categories = ["All", "Wearables", "Audio", "Display", "Computing", "Accessories", "Storage"];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [likedProducts, setLikedProducts] = useState<Set<number>>(new Set());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [cursorVariant, setCursorVariant] = useState('default');
  const heroRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // Update custom cursor
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleLike = (productId: number) => {
    setLikedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const addToCart = (product: Product) => {
    setCartCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden cursor-none" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Custom Cursor */}
      <motion.div
        ref={cursorRef}
        className="fixed w-8 h-8 pointer-events-none z-[100] mix-blend-difference"
        style={{
          left: 0,
          top: 0,
          x: -16,
          y: -16,
        }}
      >
        <motion.div
          className="w-full h-full rounded-full border-2 border-white"
          animate={{
            scale: cursorVariant === 'hover' ? 2 : 1,
            opacity: cursorVariant === 'hover' ? 0.5 : 1,
          }}
          transition={{ duration: 0.2 }}
        />
        <motion.div
          className="absolute inset-0 rounded-full bg-white"
          animate={{
            scale: cursorVariant === 'hover' ? 0 : 0.3,
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>

      {/* Particle Field */}
      <ParticleField />

      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Mouse-following gradient orb with ripple effect */}
        <motion.div
          className="absolute w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x - 300,
            y: mousePosition.y - 300,
          }}
          transition={{ type: "spring", damping: 30, stiffness: 150 }}
        />

        {/* Ripple effect */}
        <motion.div
          className="absolute w-[700px] h-[700px] border-2 border-cyan-500/20 rounded-full"
          animate={{
            x: mousePosition.x - 350,
            y: mousePosition.y - 350,
            scale: [1, 1.2, 1],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{
            x: { type: "spring", damping: 30, stiffness: 150 },
            y: { type: "spring", damping: 30, stiffness: 150 },
            scale: { duration: 2, repeat: Infinity },
            opacity: { duration: 2, repeat: Infinity },
          }}
        />

        {/* Liquid blobs */}
        <LiquidBlob color="#06b6d4" size={500} delay={0} />
        <LiquidBlob color="#8b5cf6" size={450} delay={3} />
        <LiquidBlob color="#ec4899" size={400} delay={6} />
        <LiquidBlob color="#f97316" size={380} delay={9} />

        {/* Floating geometric shapes */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${20 + i * 20}%`,
              top: `${30 + i * 10}%`,
            }}
            animate={{
              y: [0, -50, 0],
              rotate: [0, 180, 360],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "easeInOut",
            }}
          >
            <div
              className="w-20 h-20 border border-cyan-500/20 backdrop-blur-sm"
              style={{
                transform: `rotate(${i * 45}deg)`,
                borderRadius: i % 2 === 0 ? '50%' : '0%',
              }}
            />
          </motion.div>
        ))}

        {/* Grain texture overlay */}
        <div className="absolute inset-0 opacity-[0.015]"
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`
             }}
        />

        {/* Animated grid pattern */}
        <motion.div
          className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]"
          animate={{
            backgroundPosition: ['0px 0px', '50px 50px'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.8)_100%)]" />

        {/* Spotlight effect following scroll */}
        <motion.div
          className="absolute w-full h-[200px] bg-gradient-to-b from-cyan-500/10 to-transparent blur-3xl"
          style={{
            top: Math.min(scrollY * 0.5, window.innerHeight - 200),
          }}
        />
      </div>

      {/* Enhanced Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-black/40 border-b border-white/5"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        style={{
          boxShadow: scrollY > 50 ? '0 20px 60px rgba(0,0,0,0.8)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            {/* Enhanced Logo with magnetic effect */}
            <MagneticButton
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="relative">
                <motion.div
                  className="w-12 h-12 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/50"
                  animate={{
                    boxShadow: [
                      '0 10px 30px rgba(6,182,212,0.5)',
                      '0 10px 40px rgba(168,85,247,0.5)',
                      '0 10px 30px rgba(6,182,212,0.5)',
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  whileHover={{ rotate: 360 }}
                >
                  <Zap className="w-7 h-7" />
                </motion.div>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl blur-xl opacity-50"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />

                {/* Orbiting particles */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-cyan-400 rounded-full"
                    animate={{
                      rotate: [0, 360],
                      x: [0, 30 * Math.cos((i * 120 * Math.PI) / 180)],
                      y: [0, 30 * Math.sin((i * 120 * Math.PI) / 180)],
                    }}
                    transition={{
                      rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                      x: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                      y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                    }}
                    style={{
                      left: '50%',
                      top: '50%',
                      marginLeft: -4,
                      marginTop: -4,
                    }}
                  />
                ))}
              </div>
              <motion.span
                className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent tracking-tight"
                style={{ fontFamily: "'Syne', sans-serif" }}
                whileHover={{
                  scale: 1.05,
                  backgroundPosition: ['0%', '100%'],
                }}
              >
                NEXUS
              </motion.span>
            </MagneticButton>

            {/* Enhanced Search Bar */}
            <motion.div
              className="hidden md:flex items-center gap-2 flex-1 max-w-2xl mx-8 relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative w-full group">
                <input
                  type="text"
                  placeholder="Search futuristic tech..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 pl-14 text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all backdrop-blur-xl group-hover:border-white/20"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                />
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
                {searchQuery && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute right-5 top-1/2 -translate-y-1/2"
                  >
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-white/60 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-purple-500/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            </motion.div>

            {/* Enhanced Actions */}
            <div className="flex items-center gap-3">
              <MagneticButton
                className="relative p-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-cyan-500/50 transition-all backdrop-blur-xl group"
                onClick={() => setCartCount(prev => prev + 1)}
              >
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <ShoppingCart className="w-5 h-5 group-hover:text-cyan-400 transition-colors" />
                  <AnimatePresence>
                    {cartCount > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                        exit={{ scale: 0 }}
                        className="absolute -top-2 -right-2 min-w-6 h-6 px-1.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center font-bold shadow-lg"
                        style={{ fontSize: '11px', fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {cartCount}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-purple-500/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              </MagneticButton>

              <motion.button
                className="md:hidden p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl"
                whileTap={{ scale: 0.9 }}
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 pt-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Enhanced Hero Section */}
        <motion.section
          ref={heroRef}
          className="mb-20 mt-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              {/* Floating badges */}
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 backdrop-blur-xl mb-6"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-cyan-300" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Premium Tech Store
                </span>
                <Crown className="w-4 h-4 text-purple-400" />
              </motion.div>

              <h1
                className="text-6xl md:text-8xl font-black mb-6 leading-[1.1] relative"
                style={{
                  fontFamily: "'Syne', sans-serif",
                }}
              >
                {/* Animated gradient text with morphing effect */}
                <motion.div
                  style={{
                    background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%)',
                    backgroundSize: '200% 200%',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {"Experience".split('').map((char, index) => (
                    <motion.span
                      key={`exp-${index}`}
                      initial={{ opacity: 0, y: 50, rotateX: -90 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      transition={{
                        delay: index * 0.05,
                        duration: 0.5,
                        type: "spring",
                      }}
                      style={{ display: 'inline-block' }}
                    >
                      {char}
                    </motion.span>
                  ))}
                  <br />
                  {"Tomorrow".split('').map((char, index) => (
                    <motion.span
                      key={`tom-${index}`}
                      initial={{ opacity: 0, y: 50, rotateX: -90 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      transition={{
                        delay: 0.5 + index * 0.05,
                        duration: 0.5,
                        type: "spring",
                      }}
                      style={{ display: 'inline-block' }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </motion.div>

                {/* Glowing underline effect */}
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-2 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 blur-xl"
                  animate={{
                    opacity: [0.5, 1, 0.5],
                    scaleX: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                />
              </h1>
            </motion.div>

            <motion.p
              className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Cutting-edge technology meets exceptional design.
              <br />
              Discover the future of innovation.
            </motion.p>

            {/* Stats */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-8 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {[
                { icon: Rocket, label: "Fast Delivery", value: "24hrs" },
                { icon: Shield, label: "Secure Payment", value: "100%" },
                { icon: Award, label: "Top Rated", value: "4.9★" }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl"
                  whileHover={{ scale: 1.05, y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-white/50" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {stat.label}
                    </div>
                    <div className="font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {stat.value}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Enhanced Featured Products Carousel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {products.filter(p => p.featured).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.15 }}
                whileHover={{ y: -15, scale: 1.02 }}
                className="relative group cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                {/* Product tag */}
                {product.tag && (
                  <motion.div
                    className="absolute -top-3 left-6 z-10 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 font-bold text-xs shadow-lg shadow-cyan-500/50"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {product.tag}
                  </motion.div>
                )}

                <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${product.color} p-[2px] transition-all duration-500 group-hover:p-[3px]`}>
                  <div className="bg-black rounded-3xl overflow-hidden backdrop-blur-xl relative">
                    {/* Holographic effect overlay */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 35%, rgba(255,0,255,0.1) 40%, rgba(0,255,255,0.1) 45%, transparent 50%)',
                        backgroundSize: '400% 400%',
                      }}
                      animate={{
                        backgroundPosition: ['0% 0%', '100% 100%'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />

                    <div className="relative aspect-square overflow-hidden">
                      {/* Image with parallax effect */}
                      <motion.img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.15 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />

                      {/* Enhanced gradient overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/60" />

                      {/* Animated shine effect */}
                      <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                          backgroundSize: '200% 200%',
                        }}
                        animate={{
                          backgroundPosition: ['0% 0%', '200% 200%'],
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />

                      {/* Floating energy orbs */}
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className={`absolute w-4 h-4 rounded-full bg-gradient-to-r ${product.color} opacity-0 group-hover:opacity-60 blur-sm`}
                          animate={{
                            x: [
                              Math.random() * 100,
                              Math.random() * 100,
                              Math.random() * 100,
                            ],
                            y: [
                              Math.random() * 100,
                              Math.random() * 100,
                              Math.random() * 100,
                            ],
                            scale: [0, 1, 0],
                          }}
                          transition={{
                            duration: 3 + i,
                            repeat: Infinity,
                            delay: i * 0.5,
                          }}
                          style={{
                            left: `${20 + i * 30}%`,
                            top: `${20 + i * 20}%`,
                          }}
                        />
                      ))}

                      {/* Like button */}
                      <motion.div
                        className="absolute top-5 right-5"
                        whileHover={{ scale: 1.3, rotate: [0, -10, 10, 0] }}
                        whileTap={{ scale: 0.8 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(product.id);
                        }}
                      >
                        <RippleEffect className="p-3 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/10">
                          <Heart
                            className={`w-5 h-5 ${likedProducts.has(product.id) ? 'fill-pink-500 text-pink-500' : 'text-white'} transition-all duration-300`}
                          />
                        </RippleEffect>
                      </motion.div>

                      {/* Product info */}
                      <div className="absolute bottom-6 left-6 right-6">
                        <motion.h3
                          className="text-2xl font-bold mb-3"
                          style={{ fontFamily: "'Syne', sans-serif" }}
                          initial={{ opacity: 0, y: 10 }}
                          whileHover={{ opacity: 1, y: 0 }}
                        >
                          {product.name}
                        </motion.h3>

                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs text-white/50 mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                              Starting from
                            </div>
                            <span
                              className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
                              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                            >
                              ₹{product.price.toLocaleString('en-IN')}
                            </span>
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            <motion.div
                              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-black/50 backdrop-blur-xl"
                              whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                            >
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                {product.rating}
                              </span>
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Glow effect */}
                <motion.div
                  className={`absolute inset-0 rounded-3xl ${product.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}
                />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Enhanced Category Filter */}
        <motion.div
          className="mb-12 flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`relative px-8 py-4 rounded-2xl whitespace-nowrap transition-all backdrop-blur-xl overflow-hidden ${
                selectedCategory === category
                  ? 'text-white'
                  : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white hover:border-white/20'
              }`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.05 }}
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}
            >
              {selectedCategory === category && (
                <>
                  <motion.div
                    layoutId="categoryBg"
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 blur-xl opacity-60"
                    layoutId="categoryGlow"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                </>
              )}
              <span className="relative z-10">{category}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Enhanced Products Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => {
              const Icon = product.icon;
              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -12, scale: 1.02 }}
                  onHoverStart={() => setHoveredProduct(product.id)}
                  onHoverEnd={() => setHoveredProduct(null)}
                  className="group cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-500 backdrop-blur-xl ${hoveredProduct === product.id ? product.glow : ''}`}>
                    {/* 3D Tilt Effect Container */}
                    <motion.div
                      style={{
                        transformStyle: "preserve-3d",
                      }}
                      animate={
                        hoveredProduct === product.id
                          ? {
                              rotateX: -5,
                              rotateY: 5,
                              z: 50,
                            }
                          : {
                              rotateX: 0,
                              rotateY: 0,
                              z: 0,
                            }
                      }
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      <div className="relative aspect-square overflow-hidden">
                        <motion.img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          animate={
                            hoveredProduct === product.id
                              ? { scale: 1.2 }
                              : { scale: 1 }
                          }
                          transition={{ duration: 0.7, ease: "easeOut" }}
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                        {/* Animated shimmer */}
                        <motion.div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100"
                          style={{
                            background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                            backgroundSize: '200% 200%',
                          }}
                          animate={
                            hoveredProduct === product.id
                              ? { backgroundPosition: ['0% 0%', '200% 200%'] }
                              : {}
                          }
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />

                        {/* Floating Icon with enhanced animation */}
                        <motion.div
                          className={`absolute top-4 left-4 w-14 h-14 bg-gradient-to-br ${product.color} rounded-2xl flex items-center justify-center shadow-xl`}
                          animate={
                            hoveredProduct === product.id
                              ? { scale: 1.25, rotate: 360, z: 100 }
                              : { scale: 1, rotate: 0, z: 0 }
                          }
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          style={{ transformStyle: "preserve-3d" }}
                        >
                          <Icon className="w-7 h-7" />
                        </motion.div>

                        {/* Enhanced Like Button */}
                        <motion.button
                          className="absolute top-4 right-4 w-12 h-12 bg-black/50 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10"
                          whileHover={{ scale: 1.2, rotate: [0, -10, 10, -10, 0] }}
                          whileTap={{ scale: 0.8 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(product.id);
                          }}
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              likedProducts.has(product.id)
                                ? 'fill-pink-500 text-pink-500'
                                : 'text-white'
                            } transition-all duration-300`}
                          />
                        </motion.button>

                        {/* Category Badge with animation */}
                        <motion.div
                          className="absolute bottom-4 left-4 px-4 py-2 bg-black/70 backdrop-blur-xl rounded-xl border border-white/10 font-medium"
                          style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '12px' }}
                          initial={{ opacity: 0, x: -20 }}
                          animate={
                            hoveredProduct === product.id
                              ? { opacity: 1, x: 0 }
                              : { opacity: 0, x: -20 }
                          }
                          transition={{ duration: 0.3 }}
                        >
                          {product.category}
                        </motion.div>
                      </div>

                      <div className="p-5">
                        <h3
                          className="text-lg font-bold mb-3 group-hover:text-cyan-400 transition-colors"
                          style={{ fontFamily: "'Syne', sans-serif" }}
                        >
                          {product.name}
                        </h3>

                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <div className="text-xs text-white/40 mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                              Price
                            </div>
                            <span
                              className={`text-2xl font-black bg-gradient-to-r ${product.color} bg-clip-text text-transparent`}
                              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                            >
                              ₹{product.price.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                              {product.rating}
                            </span>
                          </div>
                        </div>

                        <motion.button
                          className={`w-full py-3.5 rounded-xl bg-gradient-to-r ${product.color} font-bold flex items-center justify-center gap-2 shadow-lg relative overflow-hidden group/btn`}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                          }}
                          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                          <RippleEffect className="absolute inset-0" />
                          <span className="relative z-10">Add to Cart</span>
                          <ChevronRight className="w-5 h-5 relative z-10 group-hover/btn:translate-x-1 transition-transform" />

                          {/* Button shine effect */}
                          <motion.div
                            className="absolute inset-0 opacity-0 group-hover/btn:opacity-100"
                            style={{
                              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                            }}
                            animate={
                              hoveredProduct === product.id
                                ? { x: ['-100%', '100%'] }
                                : {}
                            }
                            transition={{ duration: 0.6, ease: "easeOut", repeat: Infinity }}
                          />

                          {/* Particle burst on hover */}
                          {hoveredProduct === product.id && (
                            <>
                              {[...Array(6)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  className="absolute w-1 h-1 bg-white rounded-full"
                                  initial={{
                                    x: '50%',
                                    y: '50%',
                                    opacity: 1,
                                  }}
                                  animate={{
                                    x: `${50 + 100 * Math.cos((i * 60 * Math.PI) / 180)}%`,
                                    y: `${50 + 100 * Math.sin((i * 60 * Math.PI) / 180)}%`,
                                    opacity: 0,
                                  }}
                                  transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    delay: i * 0.1,
                                  }}
                                />
                              ))}
                            </>
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Enhanced Empty State */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-32"
          >
            <motion.div
              className="w-32 h-32 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-2xl shadow-cyan-500/50"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Search className="w-16 h-16" />
            </motion.div>
            <h3 className="text-3xl font-bold mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>
              No Products Found
            </h3>
            <p className="text-white/60 text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        )}
      </main>

      {/* Enhanced Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: "spring", bounce: 0.2 }}
              className="relative max-w-5xl w-full bg-gradient-to-br from-gray-900/95 to-black/95 border border-white/20 rounded-[2.5rem] overflow-hidden backdrop-blur-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-8 right-8 z-10 w-14 h-14 bg-black/50 backdrop-blur-xl rounded-2xl flex items-center justify-center hover:bg-black/70 transition-all border border-white/10 hover:border-white/20 group"
              >
                <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
              </button>

              <div className="grid md:grid-cols-2 gap-10 p-10">
                {/* Product Image with 3D rotation */}
                <div className="relative">
                  <motion.div
                    className={`aspect-square rounded-3xl overflow-hidden ${selectedProduct.glow} border-2 border-white/10`}
                    animate={{
                      rotateY: [0, 15, -15, 0],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </motion.div>

                  {/* Floating elements around image */}
                  <motion.div
                    className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl blur-2xl"
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl blur-2xl"
                    animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                </div>

                {/* Enhanced Product Info */}
                <div className="flex flex-col justify-center">
                  <motion.div
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r ${selectedProduct.color} font-bold mb-6 w-fit shadow-lg`}
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <selectedProduct.icon className="w-5 h-5" />
                    {selectedProduct.category}
                  </motion.div>

                  <h2
                    className="text-5xl font-black mb-6 leading-tight"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {selectedProduct.name}
                  </h2>

                  <div className="flex items-center gap-3 mb-8">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-6 h-6 ${
                            i < Math.floor(selectedProduct.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-white/20'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-white/60 text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      ({selectedProduct.rating} / 5.0) · 2.4k reviews
                    </span>
                  </div>

                  <p className="text-white/70 mb-10 leading-relaxed text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Experience the pinnacle of innovation with cutting-edge technology that pushes the boundaries of what's possible. Engineered for performance, designed for the future. Premium build quality with exceptional attention to detail.
                  </p>

                  <div className="mb-10">
                    <div className="text-sm text-white/40 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      Price
                    </div>
                    <div
                      className={`text-6xl font-black bg-gradient-to-r ${selectedProduct.color} bg-clip-text text-transparent mb-2`}
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      ₹{selectedProduct.price.toLocaleString('en-IN')}
                    </div>
                    <div className="text-sm text-white/40" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      Free shipping · 30-day returns
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <motion.button
                      className={`flex-1 py-5 rounded-2xl bg-gradient-to-r ${selectedProduct.color} font-black text-lg flex items-center justify-center gap-3 shadow-2xl relative overflow-hidden group/modal`}
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        addToCart(selectedProduct);
                        setSelectedProduct(null);
                      }}
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      <span className="relative z-10">Add to Cart</span>
                      <ShoppingCart className="w-6 h-6 relative z-10" />

                      {/* Animated background */}
                      <motion.div
                        className="absolute inset-0 bg-white/20"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.5 }}
                      />
                    </motion.button>

                    <motion.button
                      className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-xl"
                      whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleLike(selectedProduct.id)}
                    >
                      <Heart
                        className={`w-7 h-7 ${
                          likedProducts.has(selectedProduct.id)
                            ? 'fill-pink-500 text-pink-500'
                            : 'text-white'
                        } transition-all duration-300`}
                      />
                    </motion.button>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-3 gap-4 mt-10">
                    {[
                      { icon: Shield, label: "Warranty" },
                      { icon: Rocket, label: "Fast Ship" },
                      { icon: Award, label: "Premium" }
                    ].map((feature) => (
                      <motion.div
                        key={feature.label}
                        className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10"
                        whileHover={{ y: -5, scale: 1.05 }}
                      >
                        <feature.icon className="w-6 h-6 text-cyan-400" />
                        <span className="text-xs font-medium" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                          {feature.label}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden rounded-[2.5rem]">
                <motion.div
                  className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-3xl"
                  animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Floating Action Button with orbital elements */}
      <div className="fixed bottom-10 right-10 z-40">
        <MagneticButton className="relative">
          <motion.button
            className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl shadow-2xl shadow-cyan-500/50 flex items-center justify-center border border-white/20 relative overflow-hidden"
            whileHover={{ scale: 1.15, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            animate={{
              y: [0, -15, 0],
              boxShadow: [
                '0 20px 60px rgba(6,182,212,0.5)',
                '0 25px 70px rgba(168,85,247,0.6)',
                '0 20px 60px rgba(6,182,212,0.5)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="w-8 h-8 relative z-10" />

            {/* Holographic effect */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
                backgroundSize: '200% 200%',
              }}
              animate={{
                backgroundPosition: ['0% 0%', '200% 200%'],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button>

          {/* Orbital rings */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 border-2 border-cyan-400/30 rounded-full"
              style={{
                width: 80 + i * 30,
                height: 80 + i * 30,
                left: '50%',
                top: '50%',
                x: '-50%',
                y: '-50%',
              }}
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                rotate: { duration: 10 + i * 5, repeat: Infinity, ease: "linear" },
                scale: { duration: 2 + i, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 2 + i, repeat: Infinity, ease: "easeInOut" },
              }}
            />
          ))}

          {/* Orbiting particles */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`orb-${i}`}
              className="absolute w-3 h-3 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"
              style={{
                left: '50%',
                top: '50%',
              }}
              animate={{
                x: [
                  0,
                  60 * Math.cos((i * 90 * Math.PI) / 180),
                  60 * Math.cos(((i * 90 + 180) * Math.PI) / 180),
                  0,
                ],
                y: [
                  0,
                  60 * Math.sin((i * 90 * Math.PI) / 180),
                  60 * Math.sin(((i * 90 + 180) * Math.PI) / 180),
                  0,
                ],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.25,
                ease: "linear",
              }}
            />
          ))}
        </MagneticButton>
      </div>
    </div>
  );
}

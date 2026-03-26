import React, { useState, useEffect, useRef, useCallback } from "react";
import "./LandingPage.css";

// ── DATA ─────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "all",        icon: "🏪", label: "All",        count: "1.2K+", bg: "#f0ebff", color: "#6c3fcb" },
  { id: "electronics",icon: "📱", label: "Electronics", count: "240+",  bg: "#fff0e8", color: "#ff7c37" },
  { id: "fashion",    icon: "👗", label: "Fashion",     count: "380+",  bg: "#f0fff8", color: "#0ea87a" },
  { id: "home",       icon: "🛋️", label: "Home",        count: "190+",  bg: "#fff8e8", color: "#e8a830" },
  { id: "beauty",     icon: "💄", label: "Beauty",      count: "160+",  bg: "#fff0f5", color: "#e8309a" },
  { id: "sports",     icon: "⚽", label: "Sports",      count: "120+",  bg: "#e8f5ff", color: "#3090e8" },
];

const PRODUCTS = [
  { id:1,  category:"electronics", brand:"Apple",     name:"iPhone 15 Pro Max",         emoji:"📱", price:134900, original:149900, discount:10, rating:4.8, reviews:2348, badge:"hot",     tags:["Titanium","A17 Pro"] },
  { id:2,  category:"electronics", brand:"Sony",      name:"WH-1000XM5 Headphones",     emoji:"🎧", price:24990,  original:34990,  discount:29, rating:4.9, reviews:1872, badge:"sale",    tags:["Noise Cancel","30hr"] },
  { id:3,  category:"fashion",     brand:"Zara",      name:"Premium Linen Blazer",       emoji:"🧥", price:4999,   original:7999,   discount:38, rating:4.6, reviews:445,  badge:"new",     tags:["Slim Fit","Beige"] },
  { id:4,  category:"home",        brand:"Dyson",     name:"V15 Detect Absolute",        emoji:"🌀", price:52900,  original:64900,  discount:18, rating:4.7, reviews:892,  badge:"sale",    tags:["Laser","200AW"] },
  { id:5,  category:"beauty",      brand:"Charlotte Tilbury", name:"Pillow Talk Lipstick",emoji:"💄",price:3200,  original:3800,   discount:16, rating:4.9, reviews:3241, badge:"hot",     tags:["Matte","Pink"] },
  { id:6,  category:"electronics", brand:"Samsung",   name:"Galaxy Tab S9 Ultra",        emoji:"📟", price:108999, original:124999, discount:13, rating:4.7, reviews:658,  badge:"new",     tags:["14.6in","AMOLED"] },
  { id:7,  category:"sports",      brand:"Nike",      name:"Air Jordan 4 Retro",         emoji:"👟", price:14995,  original:18000,  discount:17, rating:4.8, reviews:4521, badge:"limited", tags:["Size 7-12","OG"] },
  { id:8,  category:"home",        brand:"Nespresso", name:"Vertuo Next Coffee Maker",   emoji:"☕", price:12999,  original:16000,  discount:19, rating:4.5, reviews:1230, badge:"sale",    tags:["Capsule","Crema"] },
  { id:9,  category:"fashion",     brand:"Rolex",     name:"Submariner Date 41mm",       emoji:"⌚", price:930000, original:950000, discount:2,  rating:5.0, reviews:89,   badge:"limited", tags:["Swiss","Oystersteel"] },
  { id:10, category:"electronics", brand:"DJI",       name:"Mini 4 Pro Drone",           emoji:"🚁", price:74999,  original:89999,  discount:17, rating:4.8, reviews:512,  badge:"new",     tags:["4K","Wind R6"] },
  { id:11, category:"beauty",      brand:"La Mer",    name:"Crème de la Mer Moisturiser",emoji:"🧴", price:22500,  original:26000,  discount:13, rating:4.7, reviews:723,  badge:"hot",     tags:["60ml","Anti-Age"] },
  { id:12, category:"sports",      brand:"Peloton",   name:"Bike+ Exercise Cycle",       emoji:"🚴", price:139999, original:164999, discount:15, rating:4.6, reviews:341,  badge:"sale",    tags:["Rotating","32in"] },
];

const FLASH_PRODUCTS = [
  { emoji:"💻", name:"MacBook Air M3 13\"",   newPrice:"₹1,09,900", oldPrice:"₹1,29,900", off:"15%" },
  { emoji:"🎮", name:"PS5 Slim + 2 Games",    newPrice:"₹54,990",  oldPrice:"₹72,000",   off:"24%" },
  { emoji:"🖥️", name:"LG 4K OLED 55\" TV",    newPrice:"₹89,990",  oldPrice:"₹1,19,999", off:"25%" },
];

const REVIEWS = [
  { text:"Kami Kart completely changed how I shop online. The curated selection is unmatched and delivery is always on time!", name:"Priya S.", meta:"Delhi • 120+ orders", stars:"⭐⭐⭐⭐⭐", color:"#6c3fcb", initial:"P" },
  { text:"The product quality is consistently outstanding. I've never had to return anything — everything arrives exactly as described.", name:"Rahul M.", meta:"Mumbai • 85+ orders", stars:"⭐⭐⭐⭐⭐", color:"#ff5757", initial:"R" },
  { text:"Customer support is absolutely world class. They resolved my issue within 10 minutes. Will never shop anywhere else!", name:"Ananya K.", meta:"Bangalore • 200+ orders", stars:"⭐⭐⭐⭐⭐", color:"#0ecfb5", initial:"A" },
];

// ── Animated Hero Canvas ──────────────────────────────────────
function HeroCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    const resize = () => { canvas.width = canvas.parentElement.offsetWidth; canvas.height = canvas.parentElement.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    const count = 120;
    const COLORS = ["#9b6ef3","#e8b84b","#ff5757","#0ecfb5","#4fa3f7","#ff8fce"];
    const particles = Array.from({ length: count }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.8 + 0.3,
      dx: (Math.random() - 0.5) * 0.003,
      dy: (Math.random() - 0.5) * 0.003,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.5 + 0.15,
    }));

    const ORBS = [
      { x:0.15, y:0.3, r:0.25, c:"#6c3fcb", sp:0.0006 },
      { x:0.85, y:0.6, r:0.30, c:"#e8b84b", sp:0.0004 },
      { x:0.5,  y:0.9, r:0.20, c:"#ff5757", sp:0.0008 },
      { x:0.7,  y:0.2, r:0.22, c:"#0ecfb5", sp:0.0005 },
    ];

    let t = 0;
    function draw() {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Background gradient
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, "#120828");
      bg.addColorStop(0.5, "#1e0d40");
      bg.addColorStop(1, "#0a1628");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Orbs
      ORBS.forEach((o, i) => {
        const x = o.x * W + Math.cos(t * o.sp + i * 1.2) * W * 0.06;
        const y = o.y * H + Math.sin(t * o.sp * 1.3 + i * 0.8) * H * 0.05;
        const r = o.r * Math.min(W, H);
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, o.c + "25"); g.addColorStop(0.5, o.c + "10"); g.addColorStop(1, o.c + "00");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      });

      // Grid overlay
      ctx.strokeStyle = "rgba(155,110,243,0.05)";
      ctx.lineWidth = 1;
      const gSize = 60;
      for (let x = 0; x < W; x += gSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += gSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // Particles
      for (let i = 0; i < count; i++) {
        const p = particles[i];
        const px = p.x * W, py = p.y * H;

        // connections
        for (let j = i + 1; j < Math.min(i + 8, count); j++) {
          const q = particles[j];
          const qx = q.x * W, qy = q.y * H;
          const d = Math.hypot(px - qx, py - qy);
          if (d < 120) {
            ctx.strokeStyle = `rgba(155,110,243,${0.12 * (1 - d / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(qx, qy); ctx.stroke();
          }
        }

        ctx.fillStyle = p.color + Math.round(p.alpha * 255).toString(16).padStart(2, "0");
        ctx.beginPath(); ctx.arc(px, py, p.r, 0, Math.PI * 2); ctx.fill();

        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > 1) p.dx *= -1;
        if (p.y < 0 || p.y > 1) p.dy *= -1;
      }

      t++;
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="hero-canvas" />;
}

// ── Toast System ──────────────────────────────────────────────
function useToasts() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  }, []);
  return [toasts, add];
}

// ── Flash Sale Timer ──────────────────────────────────────────
function useTimer(hours = 5, mins = 32, secs = 47) {
  const [time, setTime] = useState({ h: hours, m: mins, s: secs });
  useEffect(() => {
    const iv = setInterval(() => {
      setTime(t => {
        let { h, m, s } = t;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 5; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(iv);
  }, []);
  return time;
}

// ── Product Card ──────────────────────────────────────────────
function ProductCard({ product, onAddToCart, onWishlist, wishlisted }) {
  const fmt = n => "₹" + n.toLocaleString("en-IN");
  return (
    <div className="prod-card" style={{ animationDelay: `${product.id * 0.05}s` }}>
      <div className="prod-img-wrap">
        <span>{product.emoji}</span>
        {product.badge && <span className={`prod-badge ${product.badge}`}>{product.badge.toUpperCase()}</span>}
        <div className="prod-quick-actions">
          <button className={`prod-quick-btn ${wishlisted ? "wishlisted" : ""}`}
            onClick={e => { e.stopPropagation(); onWishlist(product); }}
            title="Wishlist">{wishlisted ? "❤️" : "🤍"}</button>
          <button className="prod-quick-btn" title="Quick View">👁</button>
          <button className="prod-quick-btn" title="Compare">⇄</button>
        </div>
        <button className="prod-add-btn" onClick={() => onAddToCart(product)}>
          🛒 Add to Cart
        </button>
      </div>
      <div className="prod-info">
        <span className="prod-brand">{product.brand}</span>
        <span className="prod-name">{product.name}</span>
        <div className="prod-rating">
          <span className="prod-stars">{"★".repeat(Math.floor(product.rating))}{product.rating % 1 ? "½" : ""}</span>
          <span style={{ fontWeight:600, color:"#3d2b5e" }}>{product.rating}</span>
          <span className="prod-review-count">({product.reviews.toLocaleString()})</span>
        </div>
        <div className="prod-pricing">
          <span className="prod-price">{fmt(product.price)}</span>
          {product.original > product.price && (
            <><span className="prod-original">{fmt(product.original)}</span>
            <span className="prod-discount">{product.discount}% off</span></>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Cart Drawer ───────────────────────────────────────────────
function CartDrawer({ items, onClose, onQty, onCheckout }) {
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const fmt = n => "₹" + n.toLocaleString("en-IN");
  return (
    <>
      <div className="cart-overlay" onClick={onClose} />
      <div className="cart-drawer">
        <div className="cart-header">
          <div>
            <div className="cart-title">Your Cart</div>
            <div className="cart-count">{items.length} item{items.length !== 1 ? "s" : ""}</div>
          </div>
          <button className="cart-close" onClick={onClose}>✕</button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🛒</div>
              <div className="cart-empty-text">Your cart is empty</div>
              <div className="cart-empty-sub">Add items to get started</div>
            </div>
          ) : items.map(item => (
            <div className="cart-item" key={item.id}>
              <div className="cart-item-emoji">{item.emoji}</div>
              <div className="cart-item-info">
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-brand">{item.brand}</div>
                <div className="cart-item-price">{fmt(item.price)}</div>
              </div>
              <div className="cart-qty">
                <button className="qty-btn" onClick={() => onQty(item.id, -1)}>−</button>
                <span className="qty-num">{item.qty}</span>
                <button className="qty-btn" onClick={() => onQty(item.id, 1)}>+</button>
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-subtotal">
              <span>Subtotal</span><span>{fmt(total)}</span>
            </div>
            <div className="cart-subtotal">
              <span>Delivery</span><span style={{color:"#0ea87a"}}>FREE</span>
            </div>
            <div className="cart-total">
              <span>Total</span><span className="cart-total-val">{fmt(total)}</span>
            </div>
            <button className="checkout-btn" onClick={onCheckout}>
              🔒 Secure Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ── Main Landing Page ─────────────────────────────────────────
export default function LandingPage({ user, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [filterTab, setFilterTab] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [search, setSearch] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [toasts, addToast] = useToasts();
  const timer = useTimer();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Filter products
  const filtered = PRODUCTS.filter(p => {
    const matchCat  = activeCategory === "all" || p.category === activeCategory;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase());
    const matchTab  = filterTab === "all" || p.badge === filterTab;
    return matchCat && matchSearch && matchTab;
  }).sort((a, b) => {
    if (sortBy === "price-asc")  return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "rating")     return b.rating - a.rating;
    return b.reviews - a.reviews;
  });

  const addToCart = (product) => {
    setCartItems(items => {
      const existing = items.find(i => i.id === product.id);
      if (existing) return items.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...items, { ...product, qty: 1 }];
    });
    addToast(`✓ ${product.name} added to cart!`);
  };

  const updateQty = (id, delta) => {
    setCartItems(items => {
      const updated = items.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i);
      return updated.filter(i => i.qty > 0);
    });
  };

  const toggleWishlist = (product) => {
    setWishlist(w => {
      const has = w.includes(product.id);
      addToast(has ? `Removed from wishlist` : `❤️ Added to wishlist!`, has ? "error" : "success");
      return has ? w.filter(id => id !== product.id) : [...w, product.id];
    });
  };

  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const userName = user?.name?.split(" ")[0] || "User";

  const pad = n => String(n).padStart(2, "0");

  return (
    <div className="lp-root">
      {/* ── NAVBAR ── */}
      <nav className={`navbar ${scrolled ? "scrolled" : "transparent"}`}>
        <div className="nav-inner">
          <a href="/" className="nav-logo">
            <div className="nav-logo-icon">K</div>
            <span className="nav-logo-text">Kami Kart</span>
          </a>

          <div className="nav-search">
            <span className="nav-search-icon">🔍</span>
            <input type="text" placeholder="Search products, brands…"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          <ul className="nav-links">
            {["Shop", "Deals", "New Arrivals", "Brands"].map(l => (
              <li key={l}><a className="nav-link" href="#shop">{l}</a></li>
            ))}
          </ul>

          <div className="nav-actions">
            <button className="nav-icon-btn" title="Wishlist" onClick={() => addToast("❤️ Wishlist coming soon!")}>
              ❤️
              {wishlist.length > 0 && <span className="nav-badge">{wishlist.length}</span>}
            </button>
            <button className="nav-icon-btn" title="Cart" onClick={() => setCartOpen(true)}>
              🛒
              {cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
            </button>
            <button className="nav-user-btn" onClick={onLogout}>
              <div className="nav-avatar">{userName[0].toUpperCase()}</div>
              {userName}
            </button>
            <button className="nav-mobile-toggle" onClick={() => setMobileMenu(m => !m)}>
              {mobileMenu ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </nav>

      {mobileMenu && (
        <div className="nav-mobile-menu">
          {["Shop", "Deals", "New Arrivals", "Brands"].map(l => (
            <a key={l} href="#shop" onClick={() => setMobileMenu(false)}>{l}</a>
          ))}
          <button onClick={() => { setCartOpen(true); setMobileMenu(false); }}>🛒 Cart ({cartCount})</button>
          <button onClick={onLogout} style={{ color: "#cc3333" }}>Sign Out</button>
        </div>
      )}

      {/* ── HERO ── */}
      <section className="hero">
        <HeroCanvas />
        <div className="hero-inner">
          <div className="hero-text">
            <div className="hero-eyebrow">✦ New Season Arrivals 2026</div>
            <h1 className="hero-title">
              The <span className="hero-accent">divine</span><br />
              marketplace<br />
              awaits you
            </h1>
            <p className="hero-sub">
              Discover thousands of premium products curated for India's most discerning shoppers — from cutting-edge electronics to haute couture fashion.
            </p>
            <div className="hero-ctas">
              <a href="#shop" className="btn-primary">Explore Collection →</a>
              <a href="#deals" className="btn-secondary">⚡ Flash Deals</a>
            </div>
            <div className="hero-stats">
              {[
                { val: "1.2M+",  label: "Happy Customers" },
                { val: "50K+",   label: "Products Listed" },
                { val: "4.9★",   label: "Average Rating" },
              ].map((s, i) => (
                <div key={i}>
                  <div className="hero-stat-val">{s.val}</div>
                  <div className="hero-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-cards-grid">
              {PRODUCTS.slice(0, 4).map(p => (
                <div key={p.id} className="hero-prod-card" onClick={() => addToCart(p)}>
                  <span className="hero-prod-emoji">{p.emoji}</span>
                  <span className="hero-prod-tag">{p.badge}</span>
                  <div className="hero-prod-name">{p.name}</div>
                  <div className="hero-prod-price">₹{p.price.toLocaleString("en-IN")}</div>
                </div>
              ))}
            </div>
            <div className="hero-featured-card" onClick={() => addToCart(PRODUCTS[1])}>
              <span className="hero-feat-emoji">{PRODUCTS[1].emoji}</span>
              <div>
                <div className="hero-feat-badge">🔥 Best Seller</div>
                <div className="hero-feat-name">{PRODUCTS[1].name}</div>
                <div className="hero-feat-price">
                  ₹{PRODUCTS[1].price.toLocaleString("en-IN")}
                  <span className="hero-feat-old">₹{PRODUCTS[1].original.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="ticker">
        <div className="ticker-inner">
          {[...Array(6)].flatMap(() => [
            { t:"🚚 Free Shipping on orders above ₹499" },
            { t:"⚡ Flash Sale — Up to 70% Off Electronics" },
            { t:"🎁 Use code KAMI200 for ₹200 off your first order" },
            { t:"✦ New arrivals every Monday & Thursday" },
            { t:"🔒 100% Secure Payments • 30-Day Returns" },
          ]).map((item, i) => (
            <span key={i} className="ticker-item">✦ {item.t}</span>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="section-inner">
          <div className="features-row">
            {[
              { icon:"🚚", bg:"#f0ebff", label:"Free Delivery", desc:"On orders above ₹499. Express 1-day available." },
              { icon:"🔒", bg:"#fff0e8", label:"Secure Checkout", desc:"256-bit SSL • RazorPay • Paytm • UPI" },
              { icon:"↩️", bg:"#f0fff8", label:"Easy Returns",   desc:"30-day hassle-free returns & full refund." },
              { icon:"🏆", bg:"#fff8e8", label:"Kami Coins",     desc:"Earn 1 coin per ₹10 spent. Redeem anytime." },
            ].map((f, i) => (
              <div key={i} className="feat-item">
                <div className="feat-icon-box" style={{ background: f.bg }}>{f.icon}</div>
                <div>
                  <div className="feat-item-title">{f.label}</div>
                  <div className="feat-item-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="section" id="shop">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-eyebrow">Browse By</div>
            <h2 className="section-title">Shop by <em>Category</em></h2>
            <p className="section-sub">From everyday essentials to rare finds — we carry it all.</p>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map(cat => (
              <div key={cat.id} className={`cat-card ${activeCategory === cat.id ? "active" : ""}`}
                onClick={() => setActiveCategory(cat.id)}>
                <div className="cat-icon-wrap" style={{ background: cat.bg }}>{cat.icon}</div>
                <span className="cat-label">{cat.label}</span>
                <span className="cat-count">{cat.count}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-inner">
          <div className="products-toolbar">
            <div className="products-filter-tabs">
              {["all","sale","new","hot","limited"].map(t => (
                <button key={t} className={`filter-tab ${filterTab === t ? "active" : ""}`}
                  onClick={() => setFilterTab(t)}>
                  {t === "all" ? "All Products" : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            <select className="products-sort" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="popular">Most Popular</option>
              <option value="rating">Top Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign:"center", padding:"60px 20px", color:"#9b8fc0" }}>
              <div style={{ fontSize:48, marginBottom:16 }}>🔍</div>
              <div style={{ fontSize:18, fontWeight:600, color:"var(--ink)" }}>No products found</div>
              <div style={{ fontSize:14, marginTop:8 }}>Try adjusting your filters or search query</div>
            </div>
          ) : (
            <div className="products-grid">
              {filtered.map(p => (
                <ProductCard key={p.id} product={p}
                  onAddToCart={addToCart}
                  onWishlist={toggleWishlist}
                  wishlisted={wishlist.includes(p.id)} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── FLASH SALE ── */}
      <section className="section" id="deals">
        <div className="section-inner">
          <div className="flash-banner">
            <div>
              <div className="flash-eyebrow">⚡ Limited Time</div>
              <h2 className="flash-title">Flash Sale<br />Ends In</h2>
              <p className="flash-sub">Unbelievable prices. Limited stock. Don't wait.</p>
              <div className="flash-timer">
                {[
                  { val: pad(timer.h), label: "Hours" },
                  { val: ":", label: "" },
                  { val: pad(timer.m), label: "Mins" },
                  { val: ":", label: "" },
                  { val: pad(timer.s), label: "Secs" },
                ].map((t, i) => t.label === "" ? (
                  <span key={i} className="timer-sep">{t.val}</span>
                ) : (
                  <div key={i} className="timer-unit">
                    <div className="timer-num">{t.val}</div>
                    <div className="timer-label">{t.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flash-products">
              {FLASH_PRODUCTS.map((fp, i) => (
                <div key={i} className="flash-prod-item" onClick={() => addToast(`⚡ ${fp.name} added to cart!`)}>
                  <span className="flash-prod-emoji">{fp.emoji}</span>
                  <div>
                    <div className="flash-prod-name">{fp.name}</div>
                    <div className="flash-prod-price">
                      <span className="flash-prod-new">{fp.newPrice}</span>
                      <span className="flash-prod-old">{fp.oldPrice}</span>
                      <span className="flash-off">{fp.off} OFF</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section className="section" style={{ background: "var(--surface)", paddingTop:80, paddingBottom:80 }}>
        <div className="section-inner">
          <div className="section-header">
            <div className="section-eyebrow">Testimonials</div>
            <h2 className="section-title">Loved by <em>millions</em></h2>
            <p className="section-sub">Real reviews from our community of shoppers.</p>
          </div>
          <div className="reviews-grid">
            {REVIEWS.map((r, i) => (
              <div key={i} className="review-card">
                <div className="review-stars">{r.stars}</div>
                <p className="review-text">"{r.text}"</p>
                <div className="review-author">
                  <div className="review-avatar" style={{ background: `linear-gradient(135deg, ${r.color}, ${r.color}99)` }}>
                    {r.initial}
                  </div>
                  <div>
                    <div className="review-name">{r.name}</div>
                    <div className="review-meta">{r.meta}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="section">
        <div className="section-inner">
          <div className="newsletter-wrap">
            <h2 className="newsletter-title">Stay in the loop ✦</h2>
            <p className="newsletter-sub">Subscribe for exclusive deals, early access, and curated picks delivered to your inbox.</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email address"
                value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)} />
              <button onClick={() => {
                if (newsletterEmail) {
                  addToast("✓ You're subscribed! Welcome to the family 🎉");
                  setNewsletterEmail("");
                } else {
                  addToast("Please enter your email", "error");
                }
              }}>Subscribe Free</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                <div style={{ width:36, height:36, background:"linear-gradient(135deg,#6c3fcb,#e8b84b)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Cormorant Garamond,serif", fontSize:20, fontWeight:700, color:"#fff" }}>K</div>
                <span style={{ fontFamily:"Cormorant Garamond,serif", fontSize:24, fontWeight:700, background:"linear-gradient(135deg,#d4a0ff,#e8b84b)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Kami Kart</span>
              </div>
              <p className="footer-brand-desc">India's most loved premium e-commerce destination — delivering joy since 2024.</p>
              <div className="footer-socials">
                {["📘","📸","🐦","▶️","📌"].map((s, i) => (
                  <a key={i} href="#social" className="footer-social">{s}</a>
                ))}
              </div>
            </div>
            {[
              { title:"Company",   links:["About Us","Careers","Press","Blog","Investors"] },
              { title:"Support",   links:["Help Centre","Track Order","Returns","Shipping","Contact Us"] },
              { title:"Legal",     links:["Privacy Policy","Terms of Service","Cookie Policy","Sitemap","Accessibility"] },
            ].map((col, i) => (
              <div key={i}>
                <div className="footer-col-title">{col.title}</div>
                <div className="footer-links">
                  {col.links.map(l => <a key={l} href="#link" className="footer-link">{l}</a>)}
                </div>
              </div>
            ))}
          </div>

          <div className="footer-bottom">
            <span className="footer-copy">© 2026 Kami Kart Pvt Ltd · Made with ❤️ in India</span>
            <div className="footer-payments" title="Accepted payment methods">
              💳🏦📱💰🔐
            </div>
          </div>
        </div>
      </footer>

      {/* ── CART DRAWER ── */}
      {cartOpen && (
        <CartDrawer
          items={cartItems}
          onClose={() => setCartOpen(false)}
          onQty={updateQty}
          onCheckout={() => {
            addToast("🎉 Checkout coming soon! (Demo mode)");
            setCartOpen(false);
          }}
        />
      )}

      {/* ── TOASTS ── */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>{t.msg}</div>
        ))}
      </div>
    </div>
  );
}
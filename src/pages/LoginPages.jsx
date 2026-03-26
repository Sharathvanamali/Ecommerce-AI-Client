import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AuthPages.css";

// ── Particle Canvas Background ───────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const COLORS = ["#9b6ef3","#e8b84b","#ff5757","#0ecfb5","#4fa3f7"];
    const count = 80;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.6,
      dy: (Math.random() - 0.5) * 0.6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.6 + 0.2,
    }));

    const orbs = Array.from({ length: 5 }, (_, i) => ({
      x: (canvas.width / 5) * i + canvas.width / 10,
      y: canvas.height * 0.5 + Math.sin(i) * 120,
      r: 120 + i * 40,
      color: COLORS[i % COLORS.length],
      speed: 0.0008 + i * 0.0003,
      phase: i * (Math.PI * 2) / 5,
    }));

    let t = 0;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Orbs
      orbs.forEach(o => {
        const x = o.x + Math.cos(t * o.speed + o.phase) * 80;
        const y = o.y + Math.sin(t * o.speed * 1.3 + o.phase) * 60;
        const g = ctx.createRadialGradient(x, y, 0, x, y, o.r);
        g.addColorStop(0, o.color + "22");
        g.addColorStop(1, o.color + "00");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, o.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Connections
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.strokeStyle = `rgba(155,110,243,${0.15 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Particles
      particles.forEach(p => {
        ctx.fillStyle = p.color + Math.round(p.alpha * 255).toString(16).padStart(2,"0");
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });

      t++;
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="auth-canvas" />;
}

// ── Main Login Component ──────────────────────────────────────
export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError(""); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email.trim()) { setError("Please enter your email address."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError("Please enter a valid email address."); return; }
    if (!form.password) { setError("Please enter your password."); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));

    const users = JSON.parse(localStorage.getItem("kamikart_users") || "[]");
    const found = users.find(u => u.email === form.email && u.password === form.password);

    if (!found) {
      setLoading(false);
      setError("Invalid email or password. Please try again.");
      return;
    }

    setLoading(false);
    onLogin({ email: found.email, name: found.name, avatar: found.avatar || null });
  };

  const handleGoogle = async () => {
    setGLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    const googleUser = {
      email: "user@gmail.com",
      name: "Google User",
      avatar: "https://lh3.googleusercontent.com/a/default-user=s64",
      provider: "google",
    };
    setGLoading(false);
    onLogin(googleUser);
  };

  return (
    <div className="auth-root">
      <ParticleCanvas />

      {/* LEFT — Brand Panel */}
      <div className="auth-left">
        <div className="auth-brand-content">
          <div className="auth-logo-wrap">
            <div className="auth-logo-icon">K</div>
            <span className="auth-logo-name">Kami Kart</span>
          </div>
          <h1 className="auth-brand-title">
            Shop the <em>divine</em><br />marketplace
          </h1>
          <p className="auth-brand-sub">
            Thousands of curated products, exclusive deals, and a seamless experience crafted just for you.
          </p>
          <div className="auth-features">
            {[
              { icon: "🛡️", title: "Secure Payments", desc: "256-bit SSL encrypted checkout" },
              { icon: "✈️", title: "Free Shipping", desc: "On orders above ₹499 across India" },
              { icon: "↩️", title: "Easy Returns", desc: "30-day no-questions-asked policy" },
              { icon: "⭐", title: "Loyalty Rewards", desc: "Earn Kami Coins on every purchase" },
            ].map((f, i) => (
              <div className="auth-feature" key={i} style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
                <span className="auth-feature-icon">{f.icon}</span>
                <div className="auth-feature-text">
                  <strong>{f.title}</strong>{f.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — Card */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2 className="auth-card-title">Welcome back ✦</h2>
            <p className="auth-card-sub">
              New to Kami Kart?{" "}
              <Link to="/signup">Create an account</Link>
            </p>
          </div>

          {/* Google Button */}
          <button className="google-btn" onClick={handleGoogle} disabled={gLoading || loading}>
            {gLoading ? (
              <><div className="btn-spinner" style={{ borderColor: "#ddd", borderTopColor: "#6c3fcb" }} />Signing in…</>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.85l6.1-6.1C34.46 3.05 29.5 1 24 1 14.8 1 6.97 6.38 3.35 14.13l7.12 5.53C12.14 13.48 17.62 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.52 24.5c0-1.64-.15-3.22-.42-4.74H24v8.97h12.66c-.55 2.93-2.2 5.42-4.68 7.09l7.19 5.59C43.34 37.54 46.52 31.5 46.52 24.5z"/>
                  <path fill="#FBBC05" d="M10.47 28.48A14.57 14.57 0 0 1 9.5 24c0-1.56.27-3.07.74-4.48l-7.12-5.53A23.88 23.88 0 0 0 1 24c0 3.85.92 7.49 2.55 10.72l6.92-6.24z"/>
                  <path fill="#34A853" d="M24 47c5.5 0 10.12-1.82 13.49-4.94l-7.19-5.59c-1.83 1.23-4.18 1.95-6.3 1.95-6.38 0-11.86-3.98-13.53-9.96l-6.92 6.24C6.97 41.62 14.8 47 24 47z"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>

          <div className="auth-divider"><span>or sign in with email</span></div>

          {error && (
            <div className="auth-error-alert">⚠️ {error}</div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label htmlFor="email">Email Address</label>
              <div className="auth-input-wrap">
                <span className="field-icon">✉</span>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => update("email", e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <div className="auth-input-wrap">
                <span className="field-icon">🔒</span>
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder="Your password"
                  value={form.password}
                  onChange={e => update("password", e.target.value)}
                  autoComplete="current-password"
                />
                <button type="button" className="eye-btn" onClick={() => setShowPw(s => !s)}>
                  {showPw ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <div className="auth-forgot-row">
              <a href="#forgot" onClick={e => { e.preventDefault(); alert("Password reset link sent! (Demo)"); }}>
                Forgot password?
              </a>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? (
                <span className="btn-loading"><div className="btn-spinner" />Signing in…</span>
              ) : "Sign In to Kami Kart"}
            </button>
          </form>

          <p className="auth-terms" style={{ marginTop: 20 }}>
            By signing in, you agree to our{" "}
            <a href="#terms">Terms of Service</a> &{" "}
            <a href="#privacy">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
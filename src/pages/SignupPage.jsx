import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AuthPages.css";

function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const COLORS = ["#e8b84b","#ff5757","#9b6ef3","#0ecfb5","#4fa3f7"];
    const count = 70;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 2.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.5, dy: (Math.random() - 0.5) * 0.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.5 + 0.2,
    }));

    let t = 0;
    const orbs = [
      { x: 0.2, y: 0.3, r: 180, color: "#e8b84b", sp: 0.0007 },
      { x: 0.8, y: 0.6, r: 220, color: "#6c3fcb", sp: 0.0005 },
      { x: 0.5, y: 0.8, r: 160, color: "#ff5757", sp: 0.0009 },
    ];

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      orbs.forEach((o, i) => {
        const x = o.x * canvas.width + Math.cos(t * o.sp + i) * 60;
        const y = o.y * canvas.height + Math.sin(t * o.sp * 1.2 + i) * 50;
        const g = ctx.createRadialGradient(x, y, 0, x, y, o.r);
        g.addColorStop(0, o.color + "1a"); g.addColorStop(1, o.color + "00");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, o.r, 0, Math.PI * 2); ctx.fill();
      });

      particles.forEach(p => {
        ctx.fillStyle = p.color + Math.round(p.alpha * 255).toString(16).padStart(2, "0");
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
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

function getStrength(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_CLASSES = ["", "weak", "fair", "good", "strong"];

export default function SignupPage({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPw: "" });
  const [showPw, setShowPw] = useState(false);
  const [showCPw, setShowCPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const update = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setError("");
    setFieldErrors(fe => ({ ...fe, [k]: "" }));
  };

  const strength = getStrength(form.password);

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = "First name is required";
    if (!form.lastName.trim()) errs.lastName = "Last name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 8) errs.password = "Minimum 8 characters";
    if (form.password !== form.confirmPw) errs.confirmPw = "Passwords do not match";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setFieldErrors(errs); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));

    const users = JSON.parse(localStorage.getItem("kamikart_users") || "[]");
    if (users.find(u => u.email === form.email)) {
      setLoading(false);
      setError("An account with this email already exists. Please log in.");
      return;
    }

    users.push({ email: form.email, name: `${form.firstName} ${form.lastName}`, password: form.password });
    localStorage.setItem("kamikart_users", JSON.stringify(users));

    setLoading(false);
    setSuccess("🎉 Account created! Redirecting to login…");
    setTimeout(() => navigate("/login"), 2000);
  };

  const handleGoogle = async () => {
    setGLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    onLogin({ email: "user@gmail.com", name: "Google User", provider: "google" });
  };

  return (
    <div className="auth-root">
      <ParticleCanvas />

      <div className="auth-left">
        <div className="auth-brand-content">
          <div className="auth-logo-wrap">
            <div className="auth-logo-icon">K</div>
            <span className="auth-logo-name">Kami Kart</span>
          </div>
          <h1 className="auth-brand-title">
            Join the <em>divine</em><br />community
          </h1>
          <p className="auth-brand-sub">
            Create your account and unlock access to thousands of curated products, exclusive member deals, and lightning-fast delivery.
          </p>
          <div className="auth-features">
            {[
              { icon: "🎁", title: "Welcome Bonus", desc: "₹200 off your first order" },
              { icon: "💎", title: "VIP Access", desc: "Early access to flash sales" },
              { icon: "🪙", title: "Kami Coins", desc: "Earn on every purchase" },
              { icon: "📱", title: "Multi-device", desc: "Shop seamlessly anywhere" },
            ].map((f, i) => (
              <div className="auth-feature" key={i}>
                <span className="auth-feature-icon">{f.icon}</span>
                <div className="auth-feature-text">
                  <strong>{f.title}</strong>{f.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2 className="auth-card-title">Create account ✦</h2>
            <p className="auth-card-sub">
              Already have an account?{" "}
              <Link to="/login">Sign in</Link>
            </p>
          </div>

          <button className="google-btn" onClick={handleGoogle} disabled={gLoading || loading}>
            {gLoading ? (
              <><div className="btn-spinner" style={{ borderColor:"#ddd", borderTopColor:"#6c3fcb" }} />Connecting…</>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.85l6.1-6.1C34.46 3.05 29.5 1 24 1 14.8 1 6.97 6.38 3.35 14.13l7.12 5.53C12.14 13.48 17.62 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.52 24.5c0-1.64-.15-3.22-.42-4.74H24v8.97h12.66c-.55 2.93-2.2 5.42-4.68 7.09l7.19 5.59C43.34 37.54 46.52 31.5 46.52 24.5z"/>
                  <path fill="#FBBC05" d="M10.47 28.48A14.57 14.57 0 0 1 9.5 24c0-1.56.27-3.07.74-4.48l-7.12-5.53A23.88 23.88 0 0 0 1 24c0 3.85.92 7.49 2.55 10.72l6.92-6.24z"/>
                  <path fill="#34A853" d="M24 47c5.5 0 10.12-1.82 13.49-4.94l-7.19-5.59c-1.83 1.23-4.18 1.95-6.3 1.95-6.38 0-11.86-3.98-13.53-9.96l-6.92 6.24C6.97 41.62 14.8 47 24 47z"/>
                </svg>
                Sign up with Google
              </>
            )}
          </button>

          <div className="auth-divider"><span>or register with email</span></div>

          {error && <div className="auth-error-alert">⚠️ {error}</div>}
          {success && <div className="auth-success-alert">{success}</div>}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-field-row">
              <div className="auth-field">
                <label>First Name</label>
                <div className="auth-input-wrap">
                  <span className="field-icon">👤</span>
                  <input type="text" placeholder="Arjun" value={form.firstName}
                    onChange={e => update("firstName", e.target.value)} />
                </div>
                {fieldErrors.firstName && <span className="field-error">✕ {fieldErrors.firstName}</span>}
              </div>
              <div className="auth-field">
                <label>Last Name</label>
                <div className="auth-input-wrap">
                  <span className="field-icon">👤</span>
                  <input type="text" placeholder="Sharma" value={form.lastName}
                    onChange={e => update("lastName", e.target.value)} />
                </div>
                {fieldErrors.lastName && <span className="field-error">✕ {fieldErrors.lastName}</span>}
              </div>
            </div>

            <div className="auth-field">
              <label>Email Address</label>
              <div className="auth-input-wrap">
                <span className="field-icon">✉</span>
                <input type="email" placeholder="you@example.com" value={form.email}
                  onChange={e => update("email", e.target.value)} />
              </div>
              {fieldErrors.email && <span className="field-error">✕ {fieldErrors.email}</span>}
            </div>

            <div className="auth-field">
              <label>Password</label>
              <div className="auth-input-wrap">
                <span className="field-icon">🔒</span>
                <input type={showPw ? "text" : "password"} placeholder="Min. 8 characters"
                  value={form.password} onChange={e => update("password", e.target.value)} />
                <button type="button" className="eye-btn" onClick={() => setShowPw(s => !s)}>
                  {showPw ? "🙈" : "👁"}
                </button>
              </div>
              {form.password && (
                <>
                  <div className="strength-bar">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`strength-seg ${i <= strength ? STRENGTH_CLASSES[strength] : ""}`} />
                    ))}
                  </div>
                  <span className="strength-label">
                    {strength > 0 ? `Password strength: ${STRENGTH_LABELS[strength]}` : ""}
                  </span>
                </>
              )}
              {fieldErrors.password && <span className="field-error">✕ {fieldErrors.password}</span>}
            </div>

            <div className="auth-field">
              <label>Confirm Password</label>
              <div className="auth-input-wrap">
                <span className="field-icon">🔐</span>
                <input type={showCPw ? "text" : "password"} placeholder="Repeat password"
                  value={form.confirmPw} onChange={e => update("confirmPw", e.target.value)} />
                <button type="button" className="eye-btn" onClick={() => setShowCPw(s => !s)}>
                  {showCPw ? "🙈" : "👁"}
                </button>
              </div>
              {fieldErrors.confirmPw && <span className="field-error">✕ {fieldErrors.confirmPw}</span>}
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading || !!success}>
              {loading ? (
                <span className="btn-loading"><div className="btn-spinner" />Creating account…</span>
              ) : "Create My Account"}
            </button>

            <p className="auth-terms">
              By creating an account you agree to our{" "}
              <a href="#terms">Terms of Service</a> and{" "}
              <a href="#privacy">Privacy Policy</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
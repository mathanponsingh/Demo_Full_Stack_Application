import { useEffect, useState } from "react";
import "./SellerAuth.css";

/* =========================================================
   FRONTEND-ONLY DEMO
   Nothing here talks to a server or database yet.
   - Sign up does NOT save a seller.
   - Sign in does NOT authenticate anyone.
   - No OTP is sent and none is verified.
   - Reset password does NOT change anything.
   These will be connected to Node.js + Express + MySQL later.
   ========================================================= */

/* ---------- Validation helpers ---------- */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MOBILE_REGEX = /^[6-9]\d{9}$/; // 10-digit Indian mobile number
const OTP_REGEX = /^\d{6}$/;

const initialValues = {
  sellerName: "",
  businessName: "",
  email: "",
  mobile: "",
  password: "",
  confirmPassword: "",
  otp: "",
  newPassword: "",
  confirmNewPassword: "",
};

function validateEmail(value, errors) {
  if (!value.trim()) errors.email = "Email address is required.";
  else if (!EMAIL_REGEX.test(value.trim())) errors.email = "Enter a valid email address.";
}

function validateNewPassword(password, confirm, passwordKey, confirmKey, errors) {
  if (!password) errors[passwordKey] = "Password is required.";
  else if (password.length < 8) errors[passwordKey] = "Password must be at least 8 characters.";

  if (!confirm) errors[confirmKey] = "Please confirm your password.";
  else if (password !== confirm) errors[confirmKey] = "Passwords do not match.";
}

// Returns an object like { email: "message" }. Empty object = no errors.
function validate(view, v) {
  const errors = {};

  if (view === "signin") {
    validateEmail(v.email, errors);
    if (!v.password) errors.password = "Password is required.";
  }

  if (view === "signup") {
    if (!v.sellerName.trim()) errors.sellerName = "Seller name is required.";
    if (!v.businessName.trim()) errors.businessName = "Business name is required.";
    validateEmail(v.email, errors);
    if (!v.mobile.trim()) errors.mobile = "Mobile number is required.";
    else if (!MOBILE_REGEX.test(v.mobile)) errors.mobile = "Enter a valid 10-digit mobile number.";
    validateNewPassword(v.password, v.confirmPassword, "password", "confirmPassword", errors);
  }

  if (view === "forgot") {
    validateEmail(v.email, errors);
  }

  if (view === "otp") {
    if (!v.otp) errors.otp = "OTP is required.";
    else if (!OTP_REGEX.test(v.otp)) errors.otp = "OTP must be exactly 6 digits.";
  }

  if (view === "reset") {
    validateNewPassword(v.newPassword, v.confirmNewPassword, "newPassword", "confirmNewPassword", errors);
  }

  return errors;
}

/* ---------- Icons (inline SVG, no library needed) ---------- */
const ICON_PATHS = {
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="11" width="16" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </>
  ),
  store: (
    <>
      <path d="M4 9 5.5 4h13L20 9" />
      <path d="M4 9v11h16V9" />
      <path d="M4 9a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0A2.7 2.7 0 0 0 20 9" />
      <path d="M10 20v-5h4v5" />
    </>
  ),
  phone: (
    <>
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <path d="M11 18h2" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 4 6v6c0 4.5 3.2 7.8 8 9 4.8-1.2 8-4.5 8-9V6l-8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  eyeOff: (
    <>
      <path d="M3 3l18 18" />
      <path d="M10.6 5.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4M6.5 6.6A17 17 0 0 0 2 12s3.6 7 10 7a9.6 9.6 0 0 0 4.2-1" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </>
  ),
  check: <path d="m5 12 5 5 9-10" />,
  alert: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v6M12 16.5v.5" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7.5v.5" />
    </>
  ),
  arrowLeft: <path d="M19 12H5m6-6-6 6 6 6" />,
  box: (
    <>
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
      <path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20V4" />
      <path d="M4 20h16" />
      <path d="m8 15 4-4 3 3 5-6" />
    </>
  ),
  wallet: (
    <>
      <rect x="3" y="6" width="18" height="14" rx="2" />
      <path d="M3 10h18M16 15h2" />
    </>
  ),
  headset: (
    <>
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <rect x="3" y="14" width="4" height="6" rx="1.5" />
      <rect x="17" y="14" width="4" height="6" rx="1.5" />
    </>
  ),
};

function Icon({ name, size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICON_PATHS[name]}
    </svg>
  );
}

/* ---------- Reusable input field ---------- */
function Field({
  id,
  label,
  icon,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  autoComplete,
  inputMode,
  maxLength,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className={`field ${error ? "has-error" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <div className="input-wrap">
        <span className="input-icon">
          <Icon name={icon} />
        </span>
        <input
          id={id}
          name={id}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={maxLength}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        {isPassword && (
          <button
            type="button"
            className="toggle-visibility"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <Icon name={showPassword ? "eyeOff" : "eye"} />
          </button>
        )}
      </div>
      {error && (
        <p className="field-error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}

/* ---------- Success / info message box ---------- */
function Notice({ notice }) {
  if (!notice) return null;
  return (
    <div className={`notice notice-${notice.type}`} role="status">
      <Icon name={notice.type === "success" ? "check" : "info"} size={18} />
      <span>{notice.text}</span>
    </div>
  );
}

/* ---------- Text shown on the left panel ---------- */
const FEATURES = [
  { icon: "box", title: "Manage products", text: "List and update your catalogue easily." },
  { icon: "chart", title: "Track sales", text: "See orders and performance at a glance." },
  { icon: "wallet", title: "Simple payouts", text: "Keep an eye on your earnings." },
  { icon: "headset", title: "Seller support", text: "Help whenever you need it." },
];

/* =========================================================
   Main component: one page, one card, five forms.
   The `view` state decides which form is visible.
   ========================================================= */
export default function SellerAuth() {
  // "signin" | "signup" | "forgot" | "otp" | "reset"
  const [view, setView] = useState("signin");
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState(null);
  const [cooldown, setCooldown] = useState(0); // seconds before "Resend OTP" works again

  // Counts the resend timer down once per second
  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // Switch form. Clears errors and typed values (optionally keeps the email).
  function goTo(nextView, nextNotice = null, keepEmail = false) {
    setView(nextView);
    setErrors({});
    setNotice(nextNotice);
    setValues((v) => ({ ...initialValues, email: keepEmail ? v.email : "" }));
  }

  // One handler for every input: updates the field named by the input's `name`
  function handleChange(e) {
    const { name, value } = e.target;
    let cleaned = value;
    if (name === "mobile") cleaned = value.replace(/\D/g, "").slice(0, 10);
    if (name === "otp") cleaned = value.replace(/\D/g, "").slice(0, 6);
    setValues((v) => ({ ...v, [name]: cleaned }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
    if (notice && notice.type === "info") setNotice(null);
  }

  // Runs validation; returns true only if the form is OK
  function checkForm() {
    const found = validate(view, values);
    setErrors(found);
    return Object.keys(found).length === 0;
  }

  /* ---------- Submit handlers (frontend only) ---------- */
  function handleSignIn(e) {
    e.preventDefault();
    if (!checkForm()) return;
    setNotice({
      type: "info",
      text: "Details look valid, but login is not connected yet. Backend integration comes later.",
    });
  }

  function handleSignUp(e) {
    e.preventDefault();
    if (!checkForm()) return;
    goTo("signin", {
      type: "success",
      text: "Form validated. Demo only: no account was saved yet. You can now sign in.",
    });
  }

  function handleForgot(e) {
    e.preventDefault();
    if (!checkForm()) return;
    goTo(
      "otp",
      { type: "info", text: "Demo mode: no OTP is actually sent. Enter any 6 digits to continue." },
      true
    );
    setCooldown(30);
  }

  function handleOtp(e) {
    e.preventDefault();
    if (!checkForm()) return;
    goTo("reset", {
      type: "success",
      text: "Demo only: the OTP was not really verified. You can set a new password now.",
    });
  }

  function handleResend() {
    if (cooldown > 0) return;
    setCooldown(30);
    setNotice({ type: "info", text: "Demo mode: no OTP was actually sent." });
  }

  function handleReset(e) {
    e.preventDefault();
    if (!checkForm()) return;
    goTo("signin", {
      type: "success",
      text: "Password rules validated. Demo only: no password was changed. Please sign in.",
    });
  }

  /* ---------- Heading text for each form ---------- */
  const headings = {
    signin: { title: "Welcome back", subtitle: "Sign in to your Seller Portal account." },
    signup: { title: "Create seller account", subtitle: "Fill in your details to get started." },
    forgot: { title: "Forgot password?", subtitle: "Enter your registered email to start the reset." },
    otp: { title: "Verify OTP", subtitle: `Enter the 6-digit OTP for ${values.email}.` },
    reset: { title: "Set new password", subtitle: "Choose a strong password of at least 8 characters." },
  };

  return (
    <div className="auth-page">
      {/* ---------- LEFT: branding ---------- */}
      <aside className="brand-panel">
        <div className="brand-inner">
          <div className="brand-logo">
            <span className="brand-logo-mark">
              <Icon name="store" size={22} />
            </span>
            <span className="brand-logo-text">Seller Portal</span>
          </div>

          <h1>Grow your business with confidence.</h1>
          <p className="brand-description">
            One place to list products, manage orders and understand your sales. Sign in or create
            your seller account to begin.
          </p>

          <ul className="feature-list">
            {FEATURES.map((f) => (
              <li key={f.title}>
                <span className="feature-icon">
                  <Icon name={f.icon} />
                </span>
                <span>
                  <strong>{f.title}</strong>
                  <small>{f.text}</small>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <span className="blob blob-1" aria-hidden="true" />
        <span className="blob blob-2" aria-hidden="true" />
      </aside>

      {/* ---------- RIGHT: forms ---------- */}
      <main className="form-panel">
        <div className="auth-card">
          <header className="form-header">
            <h2>{headings[view].title}</h2>
            <p>{headings[view].subtitle}</p>
          </header>

          <Notice notice={notice} />

          {/* `key={view}` makes React replace the form, which replays the fade animation */}

          {view === "signin" && (
            <form key="signin" className="auth-form" onSubmit={handleSignIn} noValidate>
              <Field
                id="email"
                label="Email address"
                icon="mail"
                type="email"
                value={values.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="you@business.com"
                autoComplete="email"
              />
              <Field
                id="password"
                label="Password"
                icon="lock"
                type="password"
                value={values.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <div className="form-row-end">
                <button type="button" className="link-button" onClick={() => goTo("forgot", null, true)}>
                  Forgot Password?
                </button>
              </div>
              <button type="submit" className="primary-button">
                Sign In
              </button>
              <p className="switch-text">
                Don&apos;t have an account?{" "}
                <button type="button" className="link-button" onClick={() => goTo("signup")}>
                  Sign Up
                </button>
              </p>
            </form>
          )}

          {view === "signup" && (
            <form key="signup" className="auth-form" onSubmit={handleSignUp} noValidate>
              <div className="grid-two">
                <Field
                  id="sellerName"
                  label="Seller name"
                  icon="user"
                  value={values.sellerName}
                  onChange={handleChange}
                  error={errors.sellerName}
                  placeholder="Your full name"
                  autoComplete="name"
                />
                <Field
                  id="businessName"
                  label="Business name"
                  icon="store"
                  value={values.businessName}
                  onChange={handleChange}
                  error={errors.businessName}
                  placeholder="Your business"
                  autoComplete="organization"
                />
              </div>
              <div className="grid-two">
                <Field
                  id="email"
                  label="Email address"
                  icon="mail"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  error={errors.email}
                  placeholder="you@business.com"
                  autoComplete="email"
                />
                <Field
                  id="mobile"
                  label="Mobile number"
                  icon="phone"
                  type="tel"
                  value={values.mobile}
                  onChange={handleChange}
                  error={errors.mobile}
                  placeholder="10-digit number"
                  autoComplete="tel"
                  inputMode="numeric"
                  maxLength={10}
                />
              </div>
              <div className="grid-two">
                <Field
                  id="password"
                  label="Create password"
                  icon="lock"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  error={errors.password}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                />
                <Field
                  id="confirmPassword"
                  label="Confirm password"
                  icon="lock"
                  type="password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                />
              </div>
              <button type="submit" className="primary-button">
                Create Account
              </button>
              <p className="switch-text">
                Already have an account?{" "}
                <button type="button" className="link-button" onClick={() => goTo("signin")}>
                  Sign In
                </button>
              </p>
            </form>
          )}

          {view === "forgot" && (
            <form key="forgot" className="auth-form" onSubmit={handleForgot} noValidate>
              <Field
                id="email"
                label="Email address"
                icon="mail"
                type="email"
                value={values.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="you@business.com"
                autoComplete="email"
              />
              <button type="submit" className="primary-button">
                Send OTP
              </button>
              <p className="switch-text">
                <button type="button" className="link-button with-icon" onClick={() => goTo("signin")}>
                  <Icon name="arrowLeft" size={16} /> Back to Sign In
                </button>
              </p>
            </form>
          )}

          {view === "otp" && (
            <form key="otp" className="auth-form" onSubmit={handleOtp} noValidate>
              <Field
                id="otp"
                label="Enter OTP"
                icon="shield"
                value={values.otp}
                onChange={handleChange}
                error={errors.otp}
                placeholder="6-digit OTP"
                autoComplete="one-time-code"
                inputMode="numeric"
                maxLength={6}
              />
              <div className="form-row-end">
                <button
                  type="button"
                  className="link-button"
                  onClick={handleResend}
                  disabled={cooldown > 0}
                >
                  {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
                </button>
              </div>
              <button type="submit" className="primary-button">
                Verify OTP
              </button>
              <p className="switch-text">
                <button
                  type="button"
                  className="link-button with-icon"
                  onClick={() => goTo("forgot", null, true)}
                >
                  <Icon name="arrowLeft" size={16} /> Back
                </button>
              </p>
            </form>
          )}

          {view === "reset" && (
            <form key="reset" className="auth-form" onSubmit={handleReset} noValidate>
              <Field
                id="newPassword"
                label="New password"
                icon="lock"
                type="password"
                value={values.newPassword}
                onChange={handleChange}
                error={errors.newPassword}
                placeholder="Min. 8 characters"
                autoComplete="new-password"
              />
              <Field
                id="confirmNewPassword"
                label="Confirm new password"
                icon="lock"
                type="password"
                value={values.confirmNewPassword}
                onChange={handleChange}
                error={errors.confirmNewPassword}
                placeholder="Re-enter new password"
                autoComplete="new-password"
              />
              <button type="submit" className="primary-button">
                Reset Password
              </button>
              <p className="switch-text">
                <button type="button" className="link-button with-icon" onClick={() => goTo("signin")}>
                  <Icon name="arrowLeft" size={16} /> Back to Sign In
                </button>
              </p>
            </form>
          )}

          <p className="demo-note">Frontend demo only. Backend, database and real OTP are not connected yet.</p>
        </div>
      </main>
    </div>
  );
}

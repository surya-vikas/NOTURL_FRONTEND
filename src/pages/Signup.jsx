import { useMemo, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import AuthInput from "../components/AuthInput";
import PhoneInput from "../components/PhoneInput";
import { GOOGLE_CLIENT_ID } from "../config/env";
import { getApiErrorMessage } from "../services/api";
import { loginWithGoogle, sendOtp, signupWithEmail, verifyOtp } from "../services/authService";
import { setToken, setUser } from "../utils/token";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  acceptedTerms: false,
};

const getPasswordChecks = (password) => ({
  length: password.length >= 8 && password.length <= 20,
  uppercase: /[A-Z]/.test(password),
  number: /[0-9]/.test(password),
  noSpaces: !/\s/.test(password),
});

const strengthConfig = {
  0: { label: "Very weak", color: "bg-rose-500", width: "20%" },
  1: { label: "Weak", color: "bg-rose-400", width: "35%" },
  2: { label: "Fair", color: "bg-amber-400", width: "55%" },
  3: { label: "Good", color: "bg-blue-500", width: "75%" },
  4: { label: "Strong", color: "bg-emerald-500", width: "100%" },
};

function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const normalizedEmail = formData.email.trim().toLowerCase();
  const passwordChecks = useMemo(() => getPasswordChecks(formData.password), [formData.password]);
  const passwordScore = useMemo(
    () => Object.values(passwordChecks).filter(Boolean).length,
    [passwordChecks]
  );
  const passwordStrength = strengthConfig[passwordScore];
  const isPasswordValid = useMemo(() => Object.values(passwordChecks).every(Boolean), [passwordChecks]);

  const canStartSignup = useMemo(() => {
    return (
      formData.name.trim().length >= 2 &&
      normalizedEmail.length > 0 &&
      isPhoneValid &&
      isPasswordValid &&
      formData.acceptedTerms
    );
  }, [formData, normalizedEmail, isPhoneValid, isPasswordValid]);

  const canCompleteSignup = otp.trim().length === 6;
  const showPasswordRules = isPasswordFocused || formData.password.length > 0;

  const setField = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setField(name, type === "checkbox" ? checked : value);
  };

  const handlePhoneChange = (value) => {
    setField("phone", value);
  };

  const handleStartSignup = async (event) => {
    event.preventDefault();

    if (!canStartSignup) {
      setErrorMessage(
        "Fill all fields, enter a valid phone number, meet password rules, and accept terms."
      );
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const data = await sendOtp({ email: normalizedEmail });
      setIsOtpStep(true);
      setOtp("");
      setSuccessMessage(data.message || "OTP sent. Please enter it below.");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Could not send OTP."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyAndCreate = async (event) => {
    event.preventDefault();

    if (!canCompleteSignup) {
      setErrorMessage("Enter the 6-digit OTP.");
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      await verifyOtp({ email: normalizedEmail, otp: otp.trim() });

      const signupData = await signupWithEmail({
        name: formData.name.trim(),
        email: normalizedEmail,
        phone: formData.phone,
        password: formData.password,
        acceptedTerms: formData.acceptedTerms,
      });

      if (!signupData?.token) {
        throw new Error("Token missing in signup response.");
      }

      setToken(signupData.token);
      setUser(signupData.user);
      setSuccessMessage(signupData.message || "Account created successfully.");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Could not verify OTP and create account."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const data = await sendOtp({ email: normalizedEmail });
      setSuccessMessage(data.message || "OTP resent successfully.");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Could not resend OTP."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async (credentialResponse) => {
    setErrorMessage("");
    setSuccessMessage("");

    const credential = credentialResponse?.credential;
    if (!credential) {
      setErrorMessage("Google signup did not return a valid credential.");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await loginWithGoogle(credential);

      if (!data?.token) {
        throw new Error("Token missing in Google signup response.");
      }

      setToken(data.token);
      setUser(data.user);
      setSuccessMessage(data.message || "Google signup successful.");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Google signup failed."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const editDetails = () => {
    setIsOtpStep(false);
    setOtp("");
    setErrorMessage("");
    setSuccessMessage("You can edit details and request a new OTP.");
  };

  return (
    <main className="relative min-h-[calc(100vh-var(--nav-height))] overflow-hidden bg-gradient-to-br from-blue-50 via-white to-slate-100 px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute left-1/2 top-10 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 bottom-8 h-56 w-56 rounded-full bg-indigo-300/20 blur-3xl" />

      <section className="relative mx-auto flex min-h-full w-full max-w-lg items-center">
        <article className="w-full rounded-2xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/80 transition duration-300 hover:-translate-y-0.5 hover:shadow-2xl">
          <header className="mb-6 text-center">
            <p className="font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-slate-900">NotURL</p>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">Create your account</h1>
            <p className="mt-2 text-sm text-slate-600">
              Start shortening and tracking links in seconds
            </p>
          </header>

          {!isOtpStep ? (
            <>
              {GOOGLE_CLIENT_ID ? (
                <div className="rounded-xl border border-slate-200 bg-white py-2 shadow-sm transition duration-300 hover:bg-slate-50">
                  <div className="flex justify-center">
                    <GoogleLogin
                      onSuccess={handleGoogleSignup}
                      onError={() => setErrorMessage("Google signup popup failed. Try again.")}
                      theme="outline"
                      shape="rectangular"
                      text="signup_with"
                      size="large"
                      width="320"
                    />
                  </div>
                </div>
              ) : (
                <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                  Set <code>VITE_GOOGLE_CLIENT_ID</code> in frontend environment to enable Google signup.
                </p>
              )}

              <div className="my-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <span className="h-px flex-1 bg-slate-200" />
                <span>OR CONTINUE WITH</span>
                <span className="h-px flex-1 bg-slate-200" />
              </div>

              <form className="space-y-4" onSubmit={handleStartSignup}>
                <AuthInput
                  id="email"
                  type="email"
                  label="Email"
                  value={formData.email}
                  onChange={(value) => setField("email", value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />

                <AuthInput
                  id="name"
                  label="Name"
                  value={formData.name}
                  onChange={(value) => setField("name", value)}
                  placeholder="Your full name"
                  autoComplete="name"
                  required
                />

                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-slate-700">
                    Phone
                  </label>
                  <PhoneInput
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    onValidityChange={setIsPhoneValid}
                    defaultCountry="IN"
                    placeholder="Enter phone number"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setIsPasswordFocused(true)}
                      onBlur={() => setIsPasswordFocused(false)}
                      placeholder="Create a strong password"
                      minLength={8}
                      maxLength={20}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-11 text-sm text-slate-900 shadow-sm outline-none transition duration-300 placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>

                  {showPasswordRules ? (
                    <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                        <div
                          className={`h-full ${passwordStrength.color} transition-all duration-300`}
                          style={{ width: passwordStrength.width }}
                        />
                      </div>
                      <p className="mt-2 font-semibold text-slate-700">
                        Password strength: {passwordStrength.label}
                      </p>
                      <ul className="mt-2 grid gap-1.5">
                        <li className={passwordChecks.length ? "text-emerald-600" : "text-slate-500"}>
                          - 8 to 20 characters
                        </li>
                        <li className={passwordChecks.uppercase ? "text-emerald-600" : "text-slate-500"}>
                          - At least one uppercase letter
                        </li>
                        <li className={passwordChecks.number ? "text-emerald-600" : "text-slate-500"}>
                          - At least one number
                        </li>
                        <li className={passwordChecks.noSpaces ? "text-emerald-600" : "text-slate-500"}>
                          - No spaces
                        </li>
                      </ul>
                    </div>
                  ) : null}
                </div>

                <label className="flex items-start gap-3 text-sm text-slate-600" htmlFor="acceptedTerms">
                  <input
                    id="acceptedTerms"
                    name="acceptedTerms"
                    type="checkbox"
                    checked={formData.acceptedTerms}
                    onChange={handleChange}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    required
                  />
                  <span>
                    I agree to the{" "}
                    <a href="#" className="font-medium text-blue-600 hover:underline">
                      Terms and Conditions
                    </a>
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting || !canStartSignup}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-700/25 transition duration-300 hover:scale-[1.01] hover:shadow-xl hover:shadow-blue-700/35 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span className="btn-loading">
                      <span className="loader-spinner light" aria-hidden="true" />
                      Sending OTP...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>
            </>
          ) : (
            <form className="space-y-4" onSubmit={handleVerifyAndCreate}>
              <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                <p className="mb-1">
                  <strong>Name:</strong> {formData.name}
                </p>
                <p className="mb-1">
                  <strong>Email:</strong> {normalizedEmail}
                </p>
                <p>
                  <strong>Phone:</strong> {formData.phone}
                </p>
              </div>

              <AuthInput
                id="otp"
                label="OTP"
                value={otp}
                onChange={setOtp}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                required
              />

              <button
                type="submit"
                disabled={isSubmitting || !canCompleteSignup}
                className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-700/25 transition duration-300 hover:scale-[1.01] hover:shadow-xl hover:shadow-blue-700/35 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span className="btn-loading">
                    <span className="loader-spinner light" aria-hidden="true" />
                    Creating account...
                  </span>
                ) : (
                  "Verify OTP & Create Account"
                )}
              </button>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition duration-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
                  onClick={handleResendOtp}
                  disabled={isSubmitting}
                >
                  Resend OTP
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition duration-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
                  onClick={editDetails}
                  disabled={isSubmitting}
                >
                  Edit Details
                </button>
              </div>
            </form>
          )}

          {errorMessage ? (
            <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
              {errorMessage}
            </p>
          ) : null}
          {successMessage ? (
            <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
              {successMessage}
            </p>
          ) : null}

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-blue-600 transition hover:underline">
              Sign in
            </Link>
          </p>
        </article>
      </section>
    </main>
  );
}

export default SignupPage;

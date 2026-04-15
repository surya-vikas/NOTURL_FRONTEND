import { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { FiLogIn, FiMail, FiUserPlus, FiX } from "react-icons/fi";
import { GOOGLE_CLIENT_ID } from "../config/env";
import { getApiErrorMessage } from "../services/api";
import {
  loginWithEmail,
  loginWithGoogle,
  sendOtp,
  verifyOtp,
} from "../services/authService";
import PhoneInput from "./PhoneInput";

const AUTH_MODES = {
  LOGIN: "login",
  SIGNUP: "signup",
};

function LoginPromptModal({ open, onClose, onAuthSuccess, addToast, defaultMode = AUTH_MODES.LOGIN }) {
  const [mode, setMode] = useState(AUTH_MODES.LOGIN);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setMode(defaultMode);
      setEmail("");
      setPassword("");
      setName("");
      setPhone("");
      setOtp("");
      setOtpSent(false);
      setIsSubmitting(false);
      setIsPhoneValid(false);
    }
  }, [open, defaultMode]);

  if (!open) {
    return null;
  }

  const handleEmailLogin = async (event) => {
    event.preventDefault();

    if (!email.trim() || !password) {
      addToast?.({ type: "error", message: "Enter your email and password." });
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await loginWithEmail({
        email: email.trim(),
        password,
      });

      if (!data?.token) {
        throw new Error("Token missing in login response.");
      }

      onAuthSuccess?.(data);
      addToast?.({
        type: "success",
        message: data?.message || "Login successful.",
      });
    } catch (error) {
      addToast?.({
        type: "error",
        message: getApiErrorMessage(error, "Unable to login. Please try again."),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendOtp = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      addToast?.({ type: "error", message: "Enter your name." });
      return;
    }

    if (!email.trim()) {
      addToast?.({ type: "error", message: "Enter your email." });
      return;
    }

    if (!phone || !isPhoneValid) {
      addToast?.({ type: "error", message: "Enter a valid phone number." });
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await sendOtp({ email: email.trim() });
      setOtpSent(true);
      addToast?.({
        type: "success",
        message: data?.message || "OTP sent successfully.",
      });
    } catch (error) {
      addToast?.({
        type: "error",
        message: getApiErrorMessage(error, "Unable to send OTP."),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyAndCreateAccount = async (event) => {
    event.preventDefault();

    if (!otp.trim() || otp.trim().length !== 6) {
      addToast?.({ type: "error", message: "Enter the 6-digit OTP." });
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await verifyOtp({
        email: email.trim(),
        otp: otp.trim(),
        name: name.trim(),
        phone: phone.trim(),
      });

      if (!data?.token) {
        throw new Error("Token missing in signup response.");
      }

      onAuthSuccess?.(data);
      addToast?.({
        type: "success",
        message: data?.message || "Account created successfully.",
      });
    } catch (error) {
      addToast?.({
        type: "error",
        message: getApiErrorMessage(error, "Unable to verify OTP."),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const credential = credentialResponse?.credential;
    if (!credential) {
      addToast?.({
        type: "error",
        message: "Google login did not return a valid credential.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await loginWithGoogle(credential);

      if (!data?.token) {
        throw new Error("Token missing in Google login response.");
      }

      onAuthSuccess?.(data);
      addToast?.({
        type: "success",
        message: data?.message || "Google login successful.",
      });
    } catch (error) {
      addToast?.({
        type: "error",
        message: getApiErrorMessage(error, "Google login failed."),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoginMode = mode === AUTH_MODES.LOGIN;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 px-4">
      <article className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">
              Continue
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {isLoginMode ? "Login to save and track your links" : "Create your account with OTP"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            aria-label="Close auth dialog"
          >
            <FiX />
          </button>
        </div>

        <div className="mt-5 flex justify-center">
          <div className="inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => {
              setMode(AUTH_MODES.LOGIN);
              setOtpSent(false);
              setOtp("");
            }}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              isLoginMode
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setMode(AUTH_MODES.SIGNUP);
              setPassword("");
            }}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              !isLoginMode
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            Sign Up
          </button>
          </div>
        </div>

        <div className="mt-5">
          {GOOGLE_CLIENT_ID ? (
            <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() =>
                    addToast?.({
                      type: "error",
                      message: "Google login popup failed. Try again.",
                    })
                  }
                  theme="outline"
                  shape="rectangular"
                  text={isLoginMode ? "signin_with" : "signup_with"}
                  size="large"
                  width="320"
                />
              </div>
            </div>
          ) : (
            <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:border-amber-900/30 dark:bg-amber-900/10 dark:text-amber-300">
              Set <code>VITE_GOOGLE_CLIENT_ID</code> to enable Google login.
            </p>
          )}
        </div>

        <div className="my-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          <span>{isLoginMode ? "Email Login" : "Email Sign Up"}</span>
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        </div>

        {isLoginMode ? (
          <form onSubmit={handleEmailLogin} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-700/30 transition duration-300 hover:scale-[1.01] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
            >
              <FiLogIn />
              {isSubmitting ? "Signing in..." : "Login with Email"}
            </button>
          </form>
        ) : (
          <form
            onSubmit={otpSent ? handleVerifyAndCreateAccount : handleSendOtp}
            className="space-y-3"
          >
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Full name"
              autoComplete="name"
              disabled={otpSent}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:disabled:bg-slate-900"
              required
            />
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              disabled={otpSent}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:disabled:bg-slate-900"
              required
            />
            <PhoneInput
              value={phone}
              onChange={setPhone}
              onValidityChange={setIsPhoneValid}
              placeholder="Enter phone number"
              required
              disabled={otpSent}
            />

            {otpSent ? (
              <>
                <input
                  type="text"
                  value={otp}
                  onChange={(event) =>
                    setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="Enter 6-digit OTP"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm tracking-[0.3em] text-slate-900 outline-none transition placeholder:tracking-normal placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-700/30 transition duration-300 hover:scale-[1.01] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <FiUserPlus />
                  {isSubmitting ? "Creating account..." : "Verify & Create Account"}
                </button>
              </>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-700/30 transition duration-300 hover:scale-[1.01] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
              >
                <FiMail />
                {isSubmitting ? "Sending OTP..." : "Send OTP"}
              </button>
            )}
          </form>
        )}
      </article>
    </div>
  );
}

export default LoginPromptModal;

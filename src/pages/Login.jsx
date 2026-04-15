import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import AuthInput from "../components/AuthInput";
import { GOOGLE_CLIENT_ID } from "../config/env";
import { getApiErrorMessage } from "../services/api";
import { loginWithEmail, loginWithGoogle } from "../services/authService";
import { setToken, setUser } from "../utils/token";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitButtonClass =
    "inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-700/25 transition duration-300 hover:scale-[1.01] hover:shadow-xl hover:shadow-blue-700/35 disabled:cursor-not-allowed disabled:opacity-70";

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const data = await loginWithEmail({
        email: email.trim(),
        password,
      });

      if (!data?.token) {
        throw new Error("Token missing in login response.");
      }

      setToken(data.token);
      setUser(data.user);
      setSuccessMessage(data.message || "Login successful.");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Unable to login. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    setErrorMessage("");
    setSuccessMessage("");

    const credential = credentialResponse?.credential;
    if (!credential) {
      setErrorMessage("Google login did not return a valid credential.");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await loginWithGoogle(credential);

      if (!data?.token) {
        throw new Error("Token missing in Google login response.");
      }

      setToken(data.token);
      setUser(data.user);
      setSuccessMessage(data.message || "Google login successful.");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Google login failed."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-[calc(100vh-var(--nav-height))] overflow-hidden bg-gradient-to-br from-blue-50 via-white to-slate-100 px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute left-1/2 top-10 h-60 w-60 -translate-x-1/2 rounded-full bg-blue-300/25 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 bottom-0 h-56 w-56 rounded-full bg-indigo-300/20 blur-3xl" />

      <section className="relative mx-auto flex min-h-full w-full max-w-md items-center">
        <article className="w-full rounded-2xl border border-slate-100 bg-white p-8 shadow-lg shadow-slate-200/80 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl">
          <header className="mb-6 text-center">
            <p className="font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-slate-900">NotURL</p>
            <p className="mt-2 text-sm text-slate-600">
              Welcome back {"\u{1F44B}"}
            </p>
          </header>

          <form className="space-y-4" onSubmit={handleLogin}>
            <AuthInput
              id="email"
              type="email"
              label="Email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />

            <div>
              <AuthInput
                id="password"
                type="password"
                label="Password"
                value={password}
                onChange={setPassword}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
              <div className="mt-2 text-right">
                <button
                  type="button"
                  className="text-sm font-medium text-blue-600 transition hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className={submitButtonClass}>
              {isSubmitting ? (
                <span className="btn-loading">
                  <span className="loader-spinner light" aria-hidden="true" />
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            <span>or continue with</span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          {GOOGLE_CLIENT_ID ? (
            <div className="rounded-xl border border-slate-200 bg-white py-2 shadow-sm transition duration-300 hover:bg-slate-50">
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => setErrorMessage("Google login popup failed. Try again.")}
                  theme="outline"
                  shape="rectangular"
                  text="signin_with"
                  size="large"
                  width="320"
                />
              </div>
            </div>
          ) : (
            <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
              Set <code>VITE_GOOGLE_CLIENT_ID</code> in frontend environment to enable Google login.
            </p>
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
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="font-semibold text-blue-600 transition hover:underline">
              Sign up
            </Link>
          </p>
        </article>
      </section>
    </main>
  );
}

export default LoginPage;
import { useEffect, useMemo, useState } from "react";
import { FiMail, FiPhone, FiSave, FiShield, FiUser } from "react-icons/fi";
import PhoneInput from "../components/PhoneInput";
import ToastContainer from "../components/ToastContainer";
import useToasts from "../hooks/useToasts";
import { getApiErrorMessage } from "../services/api";
import {
  getProfile,
  sendProfileUpdateOtp,
  updateProfile,
} from "../services/profileService";
import { setUser } from "../utils/token";

const initialFormState = {
  name: "",
  email: "",
  phone: "",
};

function Profile() {
  const [formData, setFormData] = useState(initialFormState);
  const [initialData, setInitialData] = useState(initialFormState);
  const [pendingPayload, setPendingPayload] = useState(null);
  const [otp, setOtp] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const { toasts, addToast, removeToast } = useToasts();

  useEffect(() => {
    const loadProfile = async () => {
      setIsFetching(true);
      try {
        const data = await getProfile();
        const user = data?.user || {};
        const nextFormData = {
          name: String(user.name || "").trim(),
          email: String(user.email || "").trim(),
          phone: String(user.phone || "").trim(),
        };
        setFormData(nextFormData);
        setInitialData(nextFormData);
        setUser(user);
      } catch (error) {
        addToast({
          type: "error",
          message: getApiErrorMessage(error, "Unable to load your profile."),
        });
      } finally {
        setIsFetching(false);
      }
    };

    loadProfile();
  }, [addToast]);

  const isSensitiveFieldChanged = useMemo(() => {
    return (
      formData.email.trim().toLowerCase() !== initialData.email.trim().toLowerCase() ||
      formData.phone.trim() !== initialData.phone.trim()
    );
  }, [formData, initialData]);

  const hasAnyChanges = useMemo(() => {
    return (
      formData.name.trim() !== initialData.name.trim() ||
      formData.email.trim().toLowerCase() !== initialData.email.trim().toLowerCase() ||
      formData.phone.trim() !== initialData.phone.trim()
    );
  }, [formData, initialData]);

  const setField = (name, value) => {
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const finalizeProfileUpdate = async (payload) => {
    setIsSubmitting(true);
    try {
      const data = await updateProfile(payload);
      const updatedUser = data?.user;
      if (!updatedUser) {
        throw new Error("Updated user data missing in response.");
      }

      const nextFormData = {
        name: String(updatedUser.name || "").trim(),
        email: String(updatedUser.email || "").trim(),
        phone: String(updatedUser.phone || "").trim(),
      };

      setFormData(nextFormData);
      setInitialData(nextFormData);
      setUser(updatedUser);
      setIsOtpModalOpen(false);
      setOtp("");
      setPendingPayload(null);
      addToast({
        type: "success",
        message: data?.message || "Profile updated successfully.",
      });
    } catch (error) {
      addToast({
        type: "error",
        message: getApiErrorMessage(error, "Unable to update profile."),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestUpdate = async (event) => {
    event.preventDefault();

    if (!hasAnyChanges) {
      addToast({ type: "error", message: "No profile changes to save." });
      return;
    }

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
    };

    if (!isSensitiveFieldChanged) {
      await finalizeProfileUpdate(payload);
      return;
    }

    setIsSendingOtp(true);
    try {
      const data = await sendProfileUpdateOtp();
      setPendingPayload(payload);
      setOtp("");
      setIsOtpModalOpen(true);
      addToast({
        type: "success",
        message: data?.message || "OTP sent to your email.",
      });
    } catch (error) {
      addToast({
        type: "error",
        message: getApiErrorMessage(error, "Unable to send OTP."),
      });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyAndUpdate = async (event) => {
    event.preventDefault();

    if (!pendingPayload) {
      setIsOtpModalOpen(false);
      return;
    }

    const normalizedOtp = String(otp || "").trim();
    if (normalizedOtp.length !== 6) {
      addToast({ type: "error", message: "Enter a valid 6-digit OTP." });
      return;
    }

    await finalizeProfileUpdate({
      ...pendingPayload,
      otp: normalizedOtp,
    });
  };

  return (
    <main className="relative min-h-[calc(100vh-var(--nav-height))] overflow-hidden bg-gradient-to-br from-blue-50 via-white to-slate-100 px-4 py-10 sm:px-6">
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-300/20 blur-3xl" />

      <section className="relative mx-auto w-full max-w-xl">
        <article className="rounded-2xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/80">
          <header>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
              Account
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Profile Settings
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Manage your personal information for NotURL.
            </p>
          </header>

          {isFetching ? (
            <div className="mt-8 rounded-xl bg-slate-50 p-6 text-sm font-medium text-slate-600">
              Loading profile details...
            </div>
          ) : (
            <form className="mt-8 space-y-4" onSubmit={handleRequestUpdate}>
              <div>
                <label htmlFor="profile-name" className="mb-2 block text-sm font-semibold text-slate-700">
                  <span className="inline-flex items-center gap-2">
                    <FiUser />
                    Name
                  </span>
                </label>
                <input
                  id="profile-name"
                  type="text"
                  value={formData.name}
                  onChange={(event) => setField("name", event.target.value)}
                  placeholder="Your full name"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition duration-300 placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="profile-email" className="mb-2 block text-sm font-semibold text-slate-700">
                  <span className="inline-flex items-center gap-2">
                    <FiMail />
                    Email
                  </span>
                </label>
                <input
                  id="profile-email"
                  type="email"
                  value={formData.email}
                  onChange={(event) => setField("email", event.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition duration-300 placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="profile-phone" className="mb-2 block text-sm font-semibold text-slate-700">
                  <span className="inline-flex items-center gap-2">
                    <FiPhone />
                    Phone Number
                  </span>
                </label>
                <PhoneInput
                  value={formData.phone}
                  onChange={(value) => setField("phone", value)}
                  defaultCountry="IN"
                  placeholder="Enter phone number"
                  required={false}
                />
              </div>

              <div className="rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-xs text-blue-700">
                <p className="inline-flex items-center gap-2 font-semibold">
                  <FiShield />
                  Security check
                </p>
                <p className="mt-1">
                  Changing your email or phone requires OTP verification sent to your current
                  email.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isSendingOtp || !hasAnyChanges}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-700/25 transition duration-300 hover:scale-[1.01] hover:shadow-xl hover:shadow-blue-700/35 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <FiSave />
                {isSendingOtp
                  ? "Sending OTP..."
                  : isSubmitting
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </form>
          )}
        </article>
      </section>

      {isOtpModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
          <form
            onSubmit={handleVerifyAndUpdate}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <h2 className="text-xl font-bold text-slate-900">Verify OTP</h2>
            <p className="mt-2 text-sm text-slate-600">
              Enter the 6-digit OTP sent to your email to confirm profile changes.
            </p>

            <label htmlFor="profile-otp" className="mt-4 block text-sm font-semibold text-slate-700">
              OTP
            </label>
            <input
              id="profile-otp"
              type="text"
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              maxLength={6}
              placeholder="123456"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition duration-300 placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              required
            />

            <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setIsOtpModalOpen(false);
                  setOtp("");
                  setPendingPayload(null);
                }}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Verifying..." : "Verify & Update"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </main>
  );
}

export default Profile;

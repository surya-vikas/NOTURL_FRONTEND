import { useEffect, useMemo, useState } from "react";
import { FiCheckCircle, FiMail, FiPhone, FiSave, FiUser, FiX } from "react-icons/fi";
import PhoneInput from "./PhoneInput";
import { getApiErrorMessage } from "../services/api";
import { getProfile, sendProfileUpdateOtp, updateProfile } from "../services/profileService";

const initialForm = {
  name: "",
  email: "",
  phone: "",
};

function ProfileEditModal({ open, user, onClose, onProfileUpdated, addToast }) {
  const [formData, setFormData] = useState(initialForm);
  const [initialData, setInitialData] = useState(initialForm);
  const [pendingPayload, setPendingPayload] = useState(null);
  const [otp, setOtp] = useState("");
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOtpStep, setIsOtpStep] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    const fallbackData = {
      name: String(user?.name || "").trim(),
      email: String(user?.email || "").trim(),
      phone: String(user?.phone || "").trim(),
    };

    setFormData(fallbackData);
    setInitialData(fallbackData);
    setIsOtpStep(false);
    setOtp("");
    setPendingPayload(null);

    const loadLatestProfile = async () => {
      setIsLoadingProfile(true);
      try {
        const data = await getProfile();
        const nextData = {
          name: String(data?.user?.name || "").trim(),
          email: String(data?.user?.email || "").trim(),
          phone: String(data?.user?.phone || "").trim(),
        };
        setFormData(nextData);
        setInitialData(nextData);
      } catch (error) {
        addToast?.({
          type: "error",
          message: getApiErrorMessage(error, "Unable to load profile data."),
        });
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadLatestProfile();
  }, [open, user, addToast]);

  const hasChanges = useMemo(
    () =>
      formData.name.trim() !== initialData.name.trim() ||
      formData.email.trim().toLowerCase() !== initialData.email.trim().toLowerCase() ||
      formData.phone.trim() !== initialData.phone.trim(),
    [formData, initialData]
  );

  const requiresOtp = useMemo(
    () =>
      formData.email.trim().toLowerCase() !== initialData.email.trim().toLowerCase() ||
      formData.phone.trim() !== initialData.phone.trim(),
    [formData, initialData]
  );

  if (!open) {
    return null;
  }

  const closeModal = () => {
    if (isSubmitting) {
      return;
    }
    onClose?.();
  };

  const setField = (name, value) => {
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const completeUpdate = async (payload) => {
    setIsSubmitting(true);
    try {
      const data = await updateProfile(payload);
      const nextUser = data?.user;
      if (!nextUser) {
        throw new Error("Profile update response missing user data.");
      }

      const nextData = {
        name: String(nextUser.name || "").trim(),
        email: String(nextUser.email || "").trim(),
        phone: String(nextUser.phone || "").trim(),
      };

      setFormData(nextData);
      setInitialData(nextData);
      onProfileUpdated?.(nextUser);
      addToast?.({
        type: "success",
        message: data?.message || "Profile updated successfully.",
      });
      onClose?.();
    } catch (error) {
      addToast?.({
        type: "error",
        message: getApiErrorMessage(error, "Unable to update profile."),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartUpdate = async (event) => {
    event.preventDefault();

    if (!hasChanges) {
      addToast?.({ type: "error", message: "No profile changes to save." });
      return;
    }

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
    };

    if (!requiresOtp) {
      await completeUpdate(payload);
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await sendProfileUpdateOtp();
      setPendingPayload(payload);
      setOtp("");
      setIsOtpStep(true);
      addToast?.({
        type: "success",
        message: data?.message || "OTP sent to your email.",
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

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    if (!pendingPayload) {
      return;
    }

    const normalizedOtp = String(otp || "").trim();
    if (normalizedOtp.length !== 6) {
      addToast?.({ type: "error", message: "Enter a valid 6-digit OTP." });
      return;
    }

    await completeUpdate({
      ...pendingPayload,
      otp: normalizedOtp,
    });
  };

  return (
    <div className="fixed inset-0 z-[75] flex items-center justify-center bg-slate-950/60 px-4">
      <article className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
              Account
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
              Edit Profile
            </h2>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            aria-label="Close profile modal"
          >
            <FiX />
          </button>
        </div>

        {isLoadingProfile ? (
          <div className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            Loading profile...
          </div>
        ) : !isOtpStep ? (
          <form className="mt-5 space-y-4" onSubmit={handleStartUpdate}>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                <span className="inline-flex items-center gap-2">
                  <FiUser />
                  Name
                </span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(event) => setField("name", event.target.value)}
                placeholder="Your full name"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                <span className="inline-flex items-center gap-2">
                  <FiMail />
                  Email
                </span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(event) => setField("email", event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
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

            <p className="rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-700 dark:border-blue-900/40 dark:bg-blue-900/15 dark:text-blue-300">
              Changing email or phone triggers OTP verification.
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-700/25 transition duration-300 hover:scale-[1.01] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
            >
              <FiSave />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </form>
        ) : (
          <form className="mt-5 space-y-4" onSubmit={handleVerifyOtp}>
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-900/10 dark:text-emerald-300">
              <p className="inline-flex items-center gap-2 font-semibold">
                <FiCheckCircle />
                OTP sent to your email
              </p>
              <p className="mt-1 text-xs">
                Enter the 6-digit code to confirm your profile changes.
              </p>
            </div>

            <input
              type="text"
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              maxLength={6}
              placeholder="123456"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              required
            />

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setIsOtpStep(false);
                  setOtp("");
                }}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Back
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
        )}
      </article>
    </div>
  );
}

export default ProfileEditModal;

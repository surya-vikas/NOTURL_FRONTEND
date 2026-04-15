import { useEffect, useMemo } from "react";
import PhoneNumberInput, { isPossiblePhoneNumber } from "react-phone-number-input";
import en from "react-phone-number-input/locale/en.json";
import "react-phone-number-input/style.css";

function PhoneInput({
  value,
  onChange,
  onValidityChange,
  defaultCountry = "IN",
  placeholder = "Enter phone number",
  required = true,
}) {
  const isValid = useMemo(() => {
    if (!value) {
      return false;
    }
    return isPossiblePhoneNumber(value);
  }, [value]);

  useEffect(() => {
    if (typeof onValidityChange === "function") {
      onValidityChange(isValid);
    }
  }, [isValid, onValidityChange]);

  return (
    <div className="w-full">
      <PhoneNumberInput
        labels={en}
        defaultCountry={defaultCountry}
        value={value || undefined}
        onChange={(nextValue) => onChange(nextValue || "")}
        placeholder={placeholder}
        international
        countryCallingCodeEditable={false}
        required={required}
        className="saas-phone flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition duration-300 focus-within:border-transparent focus-within:ring-2 focus-within:ring-blue-500"
        numberInputProps={{
          className:
            "saas-phone-number h-6 w-full border-0 bg-transparent p-0 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none",
          autoComplete: "tel",
          inputMode: "tel",
        }}
        countrySelectProps={{ "aria-label": "Select country" }}
      />
    </div>
  );
}

export default PhoneInput;

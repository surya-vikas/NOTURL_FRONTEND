function AuthInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  required = false,
  inputClassName = "",
  ...inputProps
}) {
  const baseInputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition duration-300 placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-blue-500";

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className={`${baseInputClass} ${inputClassName}`.trim()}
        {...inputProps}
      />
    </div>
  );
}

export default AuthInput;

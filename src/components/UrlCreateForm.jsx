function UrlCreateForm({
  inputId = "originalUrl",
  value,
  onChange,
  onSubmit,
  isSubmitting,
  buttonText = "Shorten Now",
  placeholder = "https://example.com/your-long-url",
}) {
  return (
    <form className="flex w-full flex-col gap-3 sm:flex-row" onSubmit={onSubmit}>
      <label htmlFor={inputId} className="sr-only">
        Original URL
      </label>
      <input
        id={inputId}
        type="url"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
        required
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex min-w-[170px] items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Processing..." : buttonText}
      </button>
    </form>
  );
}

export default UrlCreateForm;

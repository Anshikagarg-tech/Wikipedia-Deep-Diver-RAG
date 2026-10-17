import { useEffect, useRef } from "react";
import { ArrowRight, LoaderCircle, Search } from "lucide-react";

export default function SearchForm({ value, onChange, onSubmit, loading }) {
  const ref = useRef(null);

  // Auto-grow the textarea with its content
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  return (
    <form
      onSubmit={onSubmit}
      className="group rounded-2xl border border-line bg-surface shadow-[var(--shadow)] transition-all duration-300 focus-within:border-accent focus-within:shadow-[var(--shadow-lift)]"
    >
      <label htmlFor="question" className="sr-only">
        Search a topic
      </label>

      <div className="flex items-start gap-3 px-4 pt-4 sm:px-6 sm:pt-5">
        <Search size={20} className="mt-[5px] shrink-0 text-faint" aria-hidden="true" />
        <textarea
          ref={ref}
          id="question"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              e.currentTarget.form.requestSubmit();
            }
          }}
          rows={1}
          maxLength={300}
          placeholder="What would you like to explore?"
          className="min-h-8 w-full resize-none bg-transparent text-[1.0625rem] leading-8 text-ink outline-none placeholder:text-faint"
        />
      </div>

      <div className="flex items-center justify-between gap-3 px-4 pb-3 pt-2 sm:px-6 sm:pb-4">
        <span className="hidden text-xs text-faint sm:block">
          <kbd className="rounded border border-line px-1.5 py-0.5 font-sans text-[0.7rem]">Enter</kbd>{" "}
          to search ·{" "}
          <kbd className="rounded border border-line px-1.5 py-0.5 font-sans text-[0.7rem]">Shift + Enter</kbd>{" "}
          for new line
        </span>
        <span className="text-xs text-faint sm:hidden">Searching Wikipedia</span>

        <button
          type="submit"
          disabled={!value.trim() || loading}
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-on-accent transition-all hover:bg-accent-strong active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? (
            <LoaderCircle size={17} className="animate-spin" />
          ) : (
            <ArrowRight size={17} />
          )}
          {loading ? "Searching" : "Search"}
        </button>
      </div>
    </form>
  );
}

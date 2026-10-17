import { ArrowUpRight } from "lucide-react";

export default function ResultCard({ article, index }) {
  return (
    <article
      className="fade-up group relative flex gap-4 rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow)] transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-[var(--shadow-lift)] sm:gap-6 sm:p-7"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <span
        aria-hidden="true"
        className="hidden font-serif text-3xl font-normal leading-none text-accent/40 sm:block"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="min-w-0 flex-1">
        <h3 className="font-serif text-xl font-semibold leading-snug tracking-tight text-ink sm:text-2xl">
          {article.title}
        </h3>

        {article.summary && (
          <p className="mt-3 line-clamp-5 whitespace-pre-line text-[0.95rem] leading-7 text-muted">
            {article.summary}
          </p>
        )}

        {article.url && (
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex min-h-8 items-center gap-1.5 text-sm font-medium text-accent transition-colors after:absolute after:inset-0 after:content-[''] hover:text-accent-strong"
          >
            Read original article
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        )}
      </div>

      {article.thumbnail && (
        <img
          src={article.thumbnail}
          alt=""
          loading="lazy"
          className="size-20 shrink-0 rounded-xl border border-line object-cover sm:size-28"
        />
      )}
    </article>
  );
}

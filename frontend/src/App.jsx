import { useRef, useState } from "react";
import { BookOpen, CircleAlert, Compass } from "lucide-react";
import api from "./api";
import SearchForm from "./components/SearchForm";
import ResultCard from "./components/ResultCard";
import ResultSkeleton from "./components/ResultSkeleton";
import ThemeToggle from "./components/ThemeToggle";

const SUGGESTIONS = [
  "Quantum entanglement",
  "Roman aqueducts",
  "Mycorrhizal networks",
  "The Silk Road",
];

function App() {
  const [question, setQuestion] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const resultsRef = useRef(null);

  async function runSearch(text) {
    const query = text.trim();
    if (!query || loading) return;

    setLoading(true);
    setError("");
    setArticles([]);
    setSubmitted(query);

    // Bring results into view (helpful on small screens)
    requestAnimationFrame(() =>
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    );

    try {
      const response = await api.get("/api/wiki", { params: { q: query } });
      const results = response.data.articles || [];
      setArticles(results);
      if (results.length === 0) {
        setError("No articles found. Try a different search.");
      }
    } catch (err) {
      console.error(err);
      setError("Search failed. Please check that your backend is running.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    runSearch(question);
  }

  function handleSuggestion(text) {
    setQuestion(text);
    runSearch(text);
  }

  const showResults = loading || error || articles.length > 0;

  return (
    <div className="flex min-h-screen flex-col bg-bg text-ink">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-line/70 bg-bg/80 pt-[env(safe-area-inset-top)] backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3 sm:px-8 sm:py-4">
          <a href="/" className="flex items-center gap-2.5" aria-label="DeepDriver AI home">
            <span className="inline-flex size-9 items-center justify-center rounded-full bg-accent text-on-accent">
              <Compass size={18} strokeWidth={1.75} />
            </span>
            <span className="font-serif text-xl font-semibold tracking-tight sm:text-2xl">
              DeepDriver<span className="text-accent"> AI</span>
            </span>
          </a>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <div className="hero-glow">
          <section className="mx-auto max-w-3xl px-5 pb-12 pt-14 sm:px-8 sm:pb-16 sm:pt-24">
            <p className="fade-up text-xs font-medium uppercase tracking-[0.22em] text-accent">
              Wikipedia · Research companion
            </p>

            <h1
              className="fade-up mt-5 font-serif text-[clamp(2.4rem,8vw,4.75rem)] font-medium leading-[1.06] tracking-tight"
              style={{ animationDelay: "80ms" }}
            >
              Find the answers.
              <span className="block italic text-accent">Follow your curiosity.</span>
            </h1>

            <p
              className="fade-up mt-6 max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8"
              style={{ animationDelay: "160ms" }}
            >
              Search a topic and explore relevant Wikipedia articles, summaries,
              and original sources.
            </p>

            <div className="fade-up mt-9 sm:mt-11" style={{ animationDelay: "240ms" }}>
              <SearchForm
                value={question}
                onChange={setQuestion}
                onSubmit={handleSubmit}
                loading={loading}
              />

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="mr-1 text-xs text-faint">Try</span>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleSuggestion(s)}
                    disabled={loading}
                    className="min-h-9 rounded-full border border-line bg-surface/60 px-3.5 text-sm text-muted transition-colors hover:border-accent hover:bg-accent-soft hover:text-accent disabled:opacity-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Results */}
        {showResults && (
          <section
            ref={resultsRef}
            aria-live="polite"
            aria-busy={loading}
            className="mx-auto max-w-3xl scroll-mt-24 px-5 pb-20 sm:px-8"
          >
            <div className="mb-6 flex items-center gap-3 border-t border-line pt-8">
              <BookOpen size={19} className="shrink-0 text-accent" />
              <h2 className="min-w-0 font-serif text-xl font-medium sm:text-2xl">
                {loading ? (
                  "Searching articles…"
                ) : articles.length > 0 ? (
                  <>
                    {articles.length} {articles.length === 1 ? "article" : "articles"} for{" "}
                    <span className="italic text-accent [overflow-wrap:anywhere]">
                      “{submitted}”
                    </span>
                  </>
                ) : (
                  "Search results"
                )}
              </h2>
            </div>

            {loading && (
              <div className="space-y-4">
                {[0, 1, 2].map((i) => (
                  <ResultSkeleton key={i} />
                ))}
              </div>
            )}

            {error && !loading && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-2xl border border-accent/30 bg-accent-soft p-4 text-sm leading-6 text-accent sm:p-5"
              >
                <CircleAlert size={18} className="mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {!loading && articles.length > 0 && (
              <div className="space-y-4 sm:space-y-5">
                {articles.map((article, i) => (
                  <ResultCard key={article.url || article.title} article={article} index={i} />
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-line pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-5 text-xs text-faint sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span className="font-serif text-sm text-muted">DeepDriver AI</span>
          <span>
            Content from{" "}
            <a
              href="https://www.wikipedia.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-accent"
            >
              Wikipedia
            </a>
            , available under CC BY-SA.
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;

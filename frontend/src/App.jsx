
import { useState } from "react";
import { Search, ExternalLink, LoaderCircle, BookOpen } from "lucide-react";
import api from "./api";

function App() {
  const [question, setQuestion] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function askQuestion(event) {
    event.preventDefault();

    const query = question.trim();
    if (!query || loading) return;

    setLoading(true);
    setError("");
    setArticles([]);

    try {
      const response = await api.get("/api/wiki", {
        params: { q: query },
      });

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

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#292720]">
      <header className="border-b border-[#E7E0D6]">
        <div className="mx-auto flex max-w-6xl items-center px-6 py-5">
          <a href="/" className="font-serif text-2xl font-semibold tracking-tight">
            DeepDriver<span className="text-[#782E3B]"> AI</span>
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6">
        <section className="mx-auto max-w-4xl pb-16 pt-20 sm:pt-28">
          <h1 className="max-w-3xl font-serif text-5xl font-medium leading-[1.12] tracking-tight sm:text-7xl">
            Find the answers.
            <span className="block text-[#782E3B]">
              Follow your curiosity.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-[#777168]">
            Search a topic and explore relevant Wikipedia articles, summaries,
            and original sources.
          </p>

          <form
            onSubmit={askQuestion}
            className="mt-10 border border-[#DCD4C9] bg-[#FFFDF9] transition-colors focus-within:border-[#782E3B]"
          >
            <label htmlFor="question" className="sr-only">
              Search a topic
            </label>

            <textarea
              id="question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey &&
                  !event.nativeEvent.isComposing
                ) {
                  event.preventDefault();
                  event.currentTarget.form.requestSubmit();
                }
              }}
              rows={2}
              placeholder="What would you like to explore?"
              className="w-full resize-y bg-transparent px-5 py-5 text-base leading-7 outline-none placeholder:text-[#A39A8E] sm:px-6"
            />

            <div className="flex items-center justify-between gap-4 border-t border-[#EEE8DF] px-4 py-3 sm:px-6">
              <span className="text-xs text-[#93897D]">
                Search Wikipedia
              </span>

              <button
                type="submit"
                disabled={!question.trim() || loading}
                className="inline-flex items-center gap-2 bg-[#782E3B] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#5C202C] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <LoaderCircle size={17} className="animate-spin" />
                ) : (
                  <Search size={17} />
                )}
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </form>
        </section>

        {(loading || error || articles.length > 0) && (
          <section className="mx-auto max-w-4xl border-t border-[#E3DDD3] pb-20 pt-8">
            <div className="mb-6 flex items-center gap-2">
              <BookOpen size={19} className="text-[#782E3B]" />
              <h2 className="font-serif text-2xl font-medium">
                {loading ? "Searching articles" : "Search results"}
              </h2>
            </div>

            {loading && (
              <p className="text-sm text-[#777168]">
                Finding relevant Wikipedia articles...
              </p>
            )}

            {error && (
              <p
                role="alert"
                className="border border-[#D8BDB8] bg-[#FBF1ED] p-4 text-sm leading-6 text-[#782E3B]"
              >
                {error}
              </p>
            )}

            {!loading && articles.length > 0 && (
              <div className="divide-y divide-[#E3DDD3]">
                {articles.map((article) => (
                  <article
                    key={article.url || article.title}
                    className="py-6"
                  >
                    <h3 className="font-serif text-xl font-semibold text-[#35151D]">
                      {article.title}
                    </h3>

                    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#716A60]">
                      {article.summary}
                    </p>

                    {article.url && (
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#782E3B] hover:text-[#5C202C]"
                      >
                        Read original article
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="border-t border-[#E7E0D6] px-6 py-5">
        <div className="mx-auto max-w-6xl text-xs text-[#93897D]">
          DeepDriver AI
        </div>
      </footer>
    </div>
  );
}

export default App;

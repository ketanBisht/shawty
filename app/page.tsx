"use client";

import { useState } from "react";

export default function Home() {
  const [longUrl, setLongUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setShortUrl("");
    setCopied(false);

    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ longUrl, customAlias }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to shorten URL");
      }

      // Construct the full short URL
      const fullShortUrl = `${window.location.origin}${data.shortUrl}`;
      setShortUrl(fullShortUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (shortUrl) {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">
            Shawty
          </h1>
          <p className="text-purple-200">The high-performance URL shortener.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="longUrl" className="text-sm font-medium text-purple-200">
              Destination URL
            </label>
            <input
              id="longUrl"
              type="url"
              required
              placeholder="https://example.com/very/long/path"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 outline-none transition placeholder-white/30 text-white"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="customAlias" className="text-sm font-medium text-purple-200">
              Custom Alias (Optional)
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-4 rounded-l-xl bg-black/50 border border-r-0 border-white/10 text-white/50 text-sm">
                shawty.com/
              </span>
              <input
                id="customAlias"
                type="text"
                placeholder="my-link"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                className="w-full px-4 py-3 rounded-r-xl bg-black/30 border border-white/10 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 outline-none transition placeholder-white/30 text-white"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 focus:ring-4 focus:ring-purple-500/50 transition-all shadow-lg hover:shadow-cyan-500/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Shortening..." : "Shorten URL"}
          </button>
        </form>

        {shortUrl && (
          <div className="mt-8 p-6 rounded-2xl bg-black/40 border border-purple-500/30 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <p className="text-sm text-purple-200 mb-2">Your short link is ready!</p>
            <div className="flex items-center justify-between bg-black/50 border border-white/10 rounded-xl p-2 pl-4">
              <a 
                href={shortUrl} 
                target="_blank" 
                rel="noreferrer"
                className="text-cyan-400 font-medium truncate mr-4 hover:underline"
              >
                {shortUrl}
              </a>
              <button
                onClick={copyToClipboard}
                className="flex-shrink-0 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition text-sm font-medium"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";

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
    <main className="min-h-screen bg-[#FFF4E0] flex flex-col items-center justify-center p-6 font-sans text-black selection:bg-pink-300">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="w-full max-w-xl bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-xl relative"
      >
        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 w-12 h-12 bg-pink-400 border-4 border-black rounded-full" />
        <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-cyan-400 border-4 border-black" />

        <div className="text-center mb-10">
          <motion.h1 
            className="text-6xl font-black uppercase tracking-tighter mb-4"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, bounce: 0.5 }}
          >
            Shawty
          </motion.h1>
          <p className="text-xl font-bold bg-[#B3FFCC] inline-block px-3 py-1 border-2 border-black -rotate-2">
            The Brutal URL Shortener
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="longUrl" className="block text-lg font-bold uppercase">
              Destination URL
            </label>
            <input
              id="longUrl"
              type="url"
              required
              placeholder="https://example.com/very/long/path"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              className="w-full px-5 py-4 bg-gray-100 border-4 border-black text-black font-bold placeholder-gray-500 focus:outline-none focus:bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform focus:-translate-y-1 focus:-translate-x-1 focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="customAlias" className="block text-lg font-bold uppercase">
              Custom Alias (Optional)
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-4 bg-pink-300 border-4 border-black border-r-0 font-bold whitespace-nowrap">
                shawty.vercel.app/
              </span>
              <input
                id="customAlias"
                type="text"
                placeholder="my-link"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                className="w-full px-5 py-4 bg-gray-100 border-4 border-black text-black font-bold placeholder-gray-500 focus:outline-none focus:bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform focus:-translate-y-1 focus:-translate-x-1 focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-red-400 border-4 border-black font-bold flex items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <span className="text-2xl mr-3">⚠️</span>
              {error}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98, x: 4, y: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)" }}
            type="submit"
            disabled={isLoading}
            className="w-full py-5 bg-[#C4A1FF] border-4 border-black text-2xl font-black uppercase tracking-wider shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Shortening..." : "Shorten URL"}
          </motion.button>
        </form>

        {shortUrl && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-8 overflow-hidden"
          >
            <div className="p-6 bg-[#B3FFCC] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-lg font-bold uppercase mb-3 text-center">🎉 Your short link is ready!</p>
              
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <a 
                  href={shortUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex-1 px-4 py-3 bg-white border-4 border-black font-bold text-center sm:text-left truncate w-full hover:bg-gray-50 hover:underline"
                >
                  {shortUrl}
                </a>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95, x: 2, y: 2, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)" }}
                  onClick={copyToClipboard}
                  className="w-full sm:w-auto px-6 py-3 bg-pink-400 border-4 border-black font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] whitespace-nowrap"
                >
                  {copied ? "Copied!" : "Copy"}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </main>
  );
}

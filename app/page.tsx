"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

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
    <main className="min-h-screen bg-[#FFF4E0] flex flex-col items-center justify-center p-4 sm:p-6 font-sans text-black selection:bg-pink-300">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="w-full max-w-xl bg-white border-4 border-black p-5 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-xl relative"
      >
        {/* Decorative elements */}
        <div className="hidden sm:block absolute -top-4 -right-4 w-12 h-12 bg-pink-400 border-4 border-black rounded-full" />
        <div className="hidden sm:block absolute -bottom-4 -left-4 w-8 h-8 bg-cyan-400 border-4 border-black" />

        <div className="text-center mb-8 sm:mb-10 flex flex-col items-center">
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="mb-4 bg-white border-4 border-black rounded-2xl p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <Image 
              src="/icon.svg" 
              alt="Shawty Logo" 
              width={80} 
              height={80} 
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
            />
          </motion.div>
          
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter mb-3 sm:mb-4"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, bounce: 0.5 }}
          >
            Shawty
          </motion.h1>
          <p className="text-sm sm:text-base md:text-xl font-bold bg-[#B3FFCC] inline-block px-3 py-1 border-2 border-black -rotate-2">
            The Brutal URL Shortener
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div className="space-y-2">
            <label htmlFor="longUrl" className="block text-base sm:text-lg font-bold uppercase">
              Destination URL
            </label>
            <input
              id="longUrl"
              type="url"
              required
              placeholder="https://example.com/very/long/path"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              className="w-full px-4 py-3 sm:px-5 sm:py-4 bg-gray-100 border-4 border-black text-black text-sm sm:text-base font-bold placeholder-gray-500 focus:outline-none focus:bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform focus:-translate-y-1 focus:-translate-x-1 focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="customAlias" className="block text-base sm:text-lg font-bold uppercase">
              Custom Alias (Optional)
            </label>
            <div className="flex flex-col sm:flex-row">
              <span className="inline-flex items-center justify-center px-3 py-3 sm:px-4 bg-pink-300 border-4 border-black sm:border-r-0 border-b-0 sm:border-b-4 font-bold text-sm sm:text-base whitespace-nowrap">
                shawty.vercel.app/
              </span>
              <input
                id="customAlias"
                type="text"
                placeholder="my-link"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                className="w-full px-4 py-3 sm:px-5 sm:py-4 bg-gray-100 border-4 border-black text-black text-sm sm:text-base font-bold placeholder-gray-500 focus:outline-none focus:bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform focus:-translate-y-1 focus:-translate-x-1 focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-3 sm:p-4 bg-red-400 border-4 border-black font-bold text-sm sm:text-base flex items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <span className="text-xl sm:text-2xl mr-2 sm:mr-3">⚠️</span>
              {error}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98, x: 4, y: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)" }}
            type="submit"
            disabled={isLoading}
            className="w-full py-4 sm:py-5 bg-[#C4A1FF] border-4 border-black text-xl sm:text-2xl font-black uppercase tracking-wider shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Shortening..." : "Shorten URL"}
          </motion.button>
        </form>

        {shortUrl && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-6 sm:mt-8 overflow-hidden"
          >
            <div className="p-4 sm:p-6 bg-[#B3FFCC] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-base sm:text-lg font-bold uppercase mb-3 text-center">🎉 Your short link is ready!</p>
              
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 items-center">
                <a 
                  href={shortUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex-1 px-3 py-2 sm:px-4 sm:py-3 bg-white border-4 border-black font-bold text-sm sm:text-base text-center sm:text-left truncate w-full hover:bg-gray-50 hover:underline"
                >
                  {shortUrl}
                </a>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95, x: 2, y: 2, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)" }}
                  onClick={copyToClipboard}
                  className="w-full sm:w-auto px-5 py-3 sm:px-6 bg-pink-400 border-4 border-black font-bold text-sm sm:text-base uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] whitespace-nowrap"
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

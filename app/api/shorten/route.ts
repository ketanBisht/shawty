import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cache } from "@/lib/cache";
import { generateShortId, generateRandomShortId } from "@/lib/shortener";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown-ip";
    
    // Rate Limiting
    const isAllowed = await cache.checkRateLimit(ip);
    if (!isAllowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { longUrl, customAlias } = body;

    if (!longUrl || typeof longUrl !== "string") {
      return NextResponse.json(
        { error: "A valid long URL is required." },
        { status: 400 }
      );
    }

    // Basic URL validation
    try {
      new URL(longUrl);
    } catch (_) {
      return NextResponse.json(
        { error: "Invalid URL format. Must include http:// or https://" },
        { status: 400 }
      );
    }

    // 1. Handle Custom Alias
    if (customAlias && typeof customAlias === "string") {
      const alias = customAlias.trim();
      
      // Check if alias already exists
      const existing = await db.url.findUnique({
        where: { shortId: alias }
      });

      if (existing) {
        return NextResponse.json(
          { error: "This custom alias is already taken." },
          { status: 409 }
        );
      }

      // Create new custom link
      const newUrl = await db.url.create({
        data: {
          shortId: alias,
          longUrl: longUrl,
        }
      });

      // Save to cache for fast reads later
      await cache.set(alias, longUrl);

      return NextResponse.json({ shortUrl: `/${alias}`, shortId: alias }, { status: 201 });
    }

    // 2. Handle Random/Hashed Generation (Deduplication)
    // First, check if the long URL already exists in our database
    const existingLongUrl = await db.url.findFirst({
      where: { longUrl: longUrl }
    });

    if (existingLongUrl) {
      // Return the existing short link!
      return NextResponse.json({ 
        shortUrl: `/${existingLongUrl.shortId}`, 
        shortId: existingLongUrl.shortId,
        message: "Retrieved existing link."
      }, { status: 200 });
    }

    // If it doesn't exist, we generate a new short ID
    let shortId = generateShortId(longUrl);
    
    // Ensure the generated ID doesn't miraculously collide
    let collisionCheck = await db.url.findUnique({ where: { shortId } });
    while (collisionCheck) {
      shortId = generateRandomShortId();
      collisionCheck = await db.url.findUnique({ where: { shortId } });
    }

    // Save to DB
    await db.url.create({
      data: {
        shortId,
        longUrl,
      }
    });

    // Save to cache
    await cache.set(shortId, longUrl);

    return NextResponse.json({ shortUrl: `/${shortId}`, shortId }, { status: 201 });

  } catch (error) {
    console.error("Shorten API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

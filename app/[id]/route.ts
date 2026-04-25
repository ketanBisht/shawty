import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cache } from "@/lib/cache";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // 1. Check the extremely fast Cache (Redis Mock)
  const cachedLongUrl = await cache.get(id);

  if (cachedLongUrl) {
    // Cache Hit! Fast Redirect
    return NextResponse.redirect(cachedLongUrl, { status: 302 });
  }

  // 2. Cache Miss - Check Database
  const urlRecord = await db.url.findUnique({
    where: { shortId: id }
  });

  if (urlRecord) {
    // Optional: Increment click count asynchronously (don't await to save time)
    db.url.update({
      where: { id: urlRecord.id },
      data: { clicks: { increment: 1 } }
    }).catch(console.error);

    // Save to cache for the next visitor
    await cache.set(id, urlRecord.longUrl);

    // Redirect to the original URL
    return NextResponse.redirect(urlRecord.longUrl, { status: 302 });
  }

  // 3. Not Found
  // You could redirect to a custom 404 page here
  return new NextResponse("URL Not Found", { status: 404 });
}

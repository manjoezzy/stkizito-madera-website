import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const keysParam = searchParams.get("keys") || "";
    const keys = keysParam
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    const where = keys.length > 0 ? { key: { in: keys } } : {};

    const settings = await db.siteSetting.findMany({
      where,
    });

    const settingsMap: Record<string, string | null> = {};
    if (keys.length > 0) {
      for (const key of keys) {
        const found = settings.find((s) => s.key === key);
        settingsMap[key] = found ? found.value : null;
      }
    } else {
      for (const s of settings) {
        settingsMap[s.key] = s.value;
      }
    }

    return NextResponse.json({ settings: settingsMap });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { settings } = body;

    if (!settings || typeof settings !== "object" || Array.isArray(settings)) {
      return NextResponse.json({ error: "settings object is required" }, { status: 400 });
    }

    const entries = Object.entries(settings as Record<string, string>);

    for (const [key, value] of entries) {
      if (typeof key !== "string" || key.trim() === "") continue;
      await db.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }

    return NextResponse.json({ message: "Settings updated successfully" });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}

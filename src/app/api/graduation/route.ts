import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type") || "";
    const year = searchParams.get("year") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "20", 10)));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (type) {
      where.itemType = type;
    }
    if (year) {
      where.ceremonyYear = year;
    }

    const [data, total] = await Promise.all([
      db.graduationItem.findMany({
        where,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
      db.graduationItem.count({ where }),
    ]);

    return NextResponse.json({
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching graduation items:", error);
    return NextResponse.json({ error: "Failed to fetch graduation items" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, mediaUrl, itemType, ceremonyYear } = body;

    if (!title || typeof title !== "string" || title.trim() === "") {
      return NextResponse.json({ error: "title is required" }, { status: 400 });
    }
    if (!mediaUrl || typeof mediaUrl !== "string" || mediaUrl.trim() === "") {
      return NextResponse.json({ error: "mediaUrl is required" }, { status: 400 });
    }
    if (!itemType || typeof itemType !== "string" || itemType.trim() === "") {
      return NextResponse.json({ error: "itemType is required" }, { status: 400 });
    }
    if (!ceremonyYear || typeof ceremonyYear !== "string" || ceremonyYear.trim() === "") {
      return NextResponse.json({ error: "ceremonyYear is required" }, { status: 400 });
    }

    const item = await db.graduationItem.create({
      data: {
        title: title.trim(),
        mediaUrl: mediaUrl.trim(),
        itemType: itemType.trim(),
        ceremonyYear: ceremonyYear.trim(),
        description: body.description || null,
        thumbnailUrl: body.thumbnailUrl || null,
        ceremonyName: body.ceremonyName || null,
        sortOrder: body.sortOrder !== undefined ? body.sortOrder : 0,
        isPublished: body.isPublished !== undefined ? body.isPublished : true,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Error creating graduation item:", error);
    return NextResponse.json({ error: "Failed to create graduation item" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const item = await db.graduationItem.update({
      where: { id },
      data,
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error updating graduation item:", error);
    return NextResponse.json({ error: "Failed to update graduation item" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    await db.graduationItem.delete({ where: { id } });

    return NextResponse.json({ message: "Graduation item deleted successfully" });
  } catch (error) {
    console.error("Error deleting graduation item:", error);
    return NextResponse.json({ error: "Failed to delete graduation item" }, { status: 500 });
  }
}

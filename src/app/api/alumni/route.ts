import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession, hasMinRole, forbidden, unauthorized } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get("q") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "20", 10)));
    const skip = (page - 1) * limit;

    const where = q
      ? {
          OR: [
            { fullName: { contains: q } },
            { email: { contains: q } },
            { phone: { contains: q } },
            { programme: { contains: q } },
            { occupation: { contains: q } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      db.alumni.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.alumni.count({ where }),
    ]);

    return NextResponse.json({
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching alumni:", error);
    return NextResponse.json({ error: "Failed to fetch alumni" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return unauthorized();
    if (!hasMinRole(session, 'admissions-staff')) return forbidden();

    const body = await request.json();
    const { fullName } = body;

    if (!fullName || typeof fullName !== "string" || fullName.trim() === "") {
      return NextResponse.json({ error: "fullName is required" }, { status: 400 });
    }

    const alumni = await db.alumni.create({
      data: {
        fullName: fullName.trim(),
        email: body.email || null,
        phone: body.phone || null,
        graduationYear: body.graduationYear || null,
        programme: body.programme || null,
        occupation: body.occupation || null,
        employer: body.employer || null,
        district: body.district || null,
        biography: body.biography || null,
        isPublished: body.isPublished !== undefined ? body.isPublished : true,
      },
    });

    return NextResponse.json(alumni, { status: 201 });
  } catch (error) {
    console.error("Error creating alumni:", error);
    return NextResponse.json({ error: "Failed to create alumni" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return unauthorized();
    if (!hasMinRole(session, 'admissions-staff')) return forbidden();

    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const alumni = await db.alumni.update({
      where: { id },
      data,
    });

    return NextResponse.json(alumni);
  } catch (error) {
    console.error("Error updating alumni:", error);
    return NextResponse.json({ error: "Failed to update alumni" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return unauthorized();
    if (!hasMinRole(session, 'admissions-staff')) return forbidden();

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    await db.alumni.delete({ where: { id } });

    return NextResponse.json({ message: "Alumni deleted successfully" });
  } catch (error) {
    console.error("Error deleting alumni:", error);
    return NextResponse.json({ error: "Failed to delete alumni" }, { status: 500 });
  }
}

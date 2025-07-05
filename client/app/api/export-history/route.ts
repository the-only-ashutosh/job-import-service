import { NextResponse } from "next/server";

export async function GET() {
  try {
    const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/import-history/export`;
    const response = await fetch(backendUrl);

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const headers = new Headers({
      "Content-Disposition": "attachment; filename=import-history.csv",
      "Content-Type": "text/csv",
    });

    return new NextResponse(buffer, { status: 200, headers });
  } catch (error: any) {
    console.error("Export API error:", error);
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    );
  }
}

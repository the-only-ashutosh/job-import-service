import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const {
    page,
    limit,
    search,
  }: { page: number; limit: number; search: string } = await req.json();
  console.log(search);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/import-history?page=${page}&limit=${limit}&search=${search}`
  );
  const data = await res.json();
  return NextResponse.json(data);
}

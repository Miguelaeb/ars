import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/mysql-service";
import type { RowDataPacket } from "mysql2/promise";

export async function GET() {
  try {
    const autorizaciones = await executeQuery<RowDataPacket[]>({
      query: "SELECT * FROM autorizaciones ORDER BY createdAt DESC",
    });

    return NextResponse.json(autorizaciones);
  } catch (error) {
    console.error("Error fetching autorizaciones:", error);
    return NextResponse.json(
      { error: "Error al obtener autorizaciones" },
      { status: 500 }
    );
  }
}

// /app/api/facturas/route.ts
import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/mysql-service";
import type { RowDataPacket } from "mysql2/promise";

export async function GET() {
  try {
    const facturas = await executeQuery<RowDataPacket[]>({
      query: "SELECT * FROM facturas ORDER BY createdAt DESC",
    });

    return NextResponse.json(facturas);
  } catch (error) {
    console.error("Error fetching facturas:", error);
    return NextResponse.json(
      { error: "Error al obtener facturas" },
      { status: 500 }
    );
  }
}

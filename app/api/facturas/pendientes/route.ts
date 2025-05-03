import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/mysql-service";
import type { RowDataPacket } from "mysql2/promise";

export async function GET() {
  try {
    const result = await executeQuery<RowDataPacket[]>({
      query:
        "SELECT COUNT(*) as total FROM facturas WHERE estado = 'pendiente'",
    });

    // Cast explícito para acceder al valor de total
    const total = (result[0] as { total: number }).total;

    return NextResponse.json({ total });
  } catch (error) {
    console.error("Error al contar facturas pendientes:", error);
    return NextResponse.json(
      { error: "Error al contar pendientes" },
      { status: 500 }
    );
  }
}

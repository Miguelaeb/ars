import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/mysql-service";
import type { RowDataPacket } from "mysql2/promise";

export async function GET() {
  try {
    const autorizaciones = await executeQuery<RowDataPacket[]>({
      query: `
        SELECT a.*, 
               af.nombres as afiliado_nombres, 
               af.apellidos as afiliado_apellidos
        FROM autorizaciones a
        LEFT JOIN afiliados af ON a.afiliadoId = af.id_afiliado
        ORDER BY a.createdAt DESC
        LIMIT 5
      `,
    });

    const formattedAutorizaciones = autorizaciones.map((auth: any) => ({
      id: auth.id,
      numeroAutorizacion: auth.numeroAutorizacion,
      afiliadoId: auth.afiliadoId,
      tipoServicio: auth.tipoServicio,
      prestador: auth.prestador,
      fechaServicio: auth.fechaServicio,
      montoEstimado: auth.montoEstimado,
      estado: auth.estado,
      createdAt: auth.createdAt,
      afiliado: {
        nombres: auth.afiliado_nombres,
        apellidos: auth.afiliado_apellidos,
      },
    }));

    return NextResponse.json(formattedAutorizaciones);
  } catch (error) {
    console.error("Error fetching recent autorizaciones:", error);
    return NextResponse.json(
      { error: "Error al obtener autorizaciones recientes" },
      { status: 500 }
    );
  }
}

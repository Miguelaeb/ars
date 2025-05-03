import { NextResponse } from "next/server";
import { getFacturaById } from "@/lib/mysql-service";

export async function GET(
  _request: Request,
  context: { params?: { id?: string } }
) {
  const id = context.params?.id;

  if (!id) {
    return NextResponse.json({ error: "ID no proporcionado" }, { status: 400 });
  }

  try {
    const factura = await getFacturaById(id);
    if (!factura) {
      return NextResponse.json(
        { error: "Factura no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(factura);
  } catch (error) {
    console.error("Error al obtener factura por ID:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// /app/api/autorizaciones/[id]/route.ts
import { NextResponse } from "next/server";
import { getAutorizacionById } from "@/lib/mysql-service";

export async function GET(_: Request, context: { params: { id: string } }) {
  const id = context.params.id;

  if (!id) {
    return NextResponse.json({ error: "ID no proporcionado" }, { status: 400 });
  }

  try {
    const autorizacion = await getAutorizacionById(id);
    return NextResponse.json(autorizacion);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener autorización" },
      { status: 500 }
    );
  }
}

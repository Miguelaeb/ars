import { NextResponse } from "next/server";
import { DbService } from "@/lib/db-service";

export async function POST(req: Request) {
  const body = await req.json();
  const { cedula } = body;

  if (!cedula) {
    return NextResponse.json(
      { error: "Cédula no proporcionada" },
      { status: 400 }
    );
  }

  try {
    const db = DbService.getInstance();
    const afiliado = await db.getAfiliadoByCedula(cedula);

    if (!afiliado) {
      return NextResponse.json(
        { error: "Afiliado no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(afiliado);
  } catch (error) {
    console.error("Error buscando afiliado:", error);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import {
  deleteAfiliado,
  getAfiliadoById,
  updateAfiliado,
} from "@/lib/mysql-service";

// Obtener afiliado por ID
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: "ID no proporcionado" }, { status: 400 });
  }

  try {
    const afiliado = await getAfiliadoById(id);

    if (!afiliado) {
      return NextResponse.json(
        { error: "Afiliado no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(afiliado);
  } catch (error) {
    console.error(`Error fetching afiliado ${id}:`, error);
    return NextResponse.json(
      { error: "Error al obtener afiliado" },
      { status: 500 }
    );
  }
}

// Actualizar afiliado por ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: "ID no proporcionado" }, { status: 400 });
  }

  try {
    const data = await req.json();
    await updateAfiliado(id, data);

    return NextResponse.json({ message: "Afiliado actualizado correctamente" });
  } catch (error) {
    console.error(`Error actualizando afiliado ${id}:`, error);
    return NextResponse.json(
      { error: "Error al actualizar afiliado" },
      { status: 500 }
    );
  }
}

// Eliminar afiliado por ID
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: "ID no proporcionado" }, { status: 400 });
  }

  try {
    const afiliado = await getAfiliadoById(id);

    if (!afiliado) {
      return NextResponse.json(
        { error: "Afiliado no encontrado" },
        { status: 404 }
      );
    }

    await deleteAfiliado(id);

    return NextResponse.json({ message: "Afiliado eliminado correctamente" });
  } catch (error) {
    console.error(`Error eliminando afiliado ${id}:`, error);
    return NextResponse.json(
      { error: "Error al eliminar afiliado" },
      { status: 500 }
    );
  }
}

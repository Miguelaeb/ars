import { NextResponse } from "next/server";
import { deleteUser, updateUser } from "@/lib/db-service"; // Asegúrate de tener `updateUser` en tu db-service
import type { NextRequest } from "next/server";

// Ruta para actualizar usuario
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    await updateUser(params.id, body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return NextResponse.json(
      { error: "No se pudo actualizar el usuario" },
      { status: 500 }
    );
  }
}

// Ruta para eliminar usuario
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await deleteUser(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "No se pudo eliminar el usuario" },
      { status: 500 }
    );
  }
}

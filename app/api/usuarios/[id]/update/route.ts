import { NextRequest, NextResponse } from "next/server";
import { updateUser } from "@/lib/db-service";

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const updates: any = {};

    if (body.role) updates.role = body.role;
    updates.updatedAt = new Date().toISOString();

    await updateUser(context.params.id, updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error actualizando usuario:", error);
    return NextResponse.json(
      { error: "Error al actualizar usuario" },
      { status: 500 }
    );
  }
}

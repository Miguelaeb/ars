import { NextResponse } from "next/server";
import { updateAutorizacionStatus } from "@/lib/mysql-service";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const id = formData.get("id")?.toString() || "";
    const estado = formData.get("estado")?.toString() || "";
    const comentarios = formData.get("comentarios")?.toString() || "";

    const updated = await updateAutorizacionStatus(id, estado, comentarios);

    return NextResponse.json({
      success: true,
      message: `Autorización ${
        estado === "aprobada" ? "aprobada" : "rechazada"
      } correctamente.`,
      data: updated,
    });
  } catch (error) {
    console.error("Error al actualizar estado:", error);
    return NextResponse.json(
      { success: false, message: "Error al actualizar estado." },
      { status: 500 }
    );
  }
}

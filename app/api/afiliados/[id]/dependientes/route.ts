import { NextResponse, type NextRequest } from "next/server";
import { executeQuery } from "@/lib/mysql-service";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: "ID no proporcionado" }, { status: 400 });
  }

  try {
    const dependientes = await executeQuery({
      query: "SELECT * FROM dependientes WHERE afiliado_id = ?",
      values: [id],
    });

    return NextResponse.json(dependientes);
  } catch (error) {
    console.error("Error al obtener dependientes:", error);
    return NextResponse.json(
      { error: "Error al obtener dependientes" },
      { status: 500 }
    );
  }
}

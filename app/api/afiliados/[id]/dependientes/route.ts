import { NextResponse, type NextRequest } from "next/server";
import { executeQuery } from "@/lib/mysql-service";

// Obtener dependientes de un afiliado por ID
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

// Registrar nuevos dependientes para un afiliado
export async function POST(
  request: Request,
  context: { params: { id: string } }
) {
  const afiliadoId = context.params?.id;

  if (!afiliadoId) {
    return NextResponse.json(
      { error: "ID de afiliado no proporcionado" },
      { status: 400 }
    );
  }

  try {
    const dependientes = await request.json();

    if (!Array.isArray(dependientes)) {
      return NextResponse.json(
        {
          error:
            "El cuerpo de la solicitud debe ser un arreglo de dependientes",
        },
        { status: 400 }
      );
    }

    for (const dep of dependientes) {
      await executeQuery({
        query: `
          INSERT INTO dependientes 
            (afiliado_id, nombre, apellido, cedula, fecha_nacimiento, genero, parentesco, telefono)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        values: [
          afiliadoId,
          dep.nombre || null,
          dep.apellido || null,
          dep.cedula || null,
          dep.fechaNacimiento || null,
          dep.genero || null,
          dep.parentesco || null,
          dep.telefono || null,
        ],
      });
    }

    return NextResponse.json(dependientes, { status: 201 });
  } catch (error) {
    console.error("Error al guardar dependientes:", error);
    return NextResponse.json(
      { error: "Error al guardar dependientes" },
      { status: 500 }
    );
  }
}

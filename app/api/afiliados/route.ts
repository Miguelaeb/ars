import { NextResponse } from "next/server";
import {
  getAfiliados,
  createAfiliado,
  getAfiliadoByCedula,
  createDependientes,
} from "@/lib/mysql-service";

// Obtener todos los afiliados
export async function GET() {
  try {
    const afiliados = await getAfiliados();
    const afiliadosConId = afiliados.map((a) => ({
      ...a,
      id: a.id_afiliado, // compatibilidad con frontend
    }));
    return NextResponse.json(afiliadosConId);
  } catch (error) {
    console.error("Error al obtener afiliados:", error);
    return NextResponse.json(
      { error: "Error al obtener afiliados" },
      { status: 500 }
    );
  }
}

// Registrar un nuevo afiliado
export async function POST(req: Request) {
  try {
    const { afiliado, dependientes } = await req.json();

    const afiliadoExistente = await getAfiliadoByCedula(afiliado.cedula);
    if (afiliadoExistente) {
      return NextResponse.json(
        { error: "Ya existe un afiliado con esta cédula." },
        { status: 409 }
      );
    }

    const nuevoAfiliado = await createAfiliado(afiliado);

    if (dependientes && Array.isArray(dependientes)) {
      await createDependientes(nuevoAfiliado.id_afiliado, dependientes);
    }

    return NextResponse.json({
      message: "Afiliado registrado correctamente",
      afiliado: {
        ...nuevoAfiliado,
        id: nuevoAfiliado.id_afiliado,
      },
    });
  } catch (error) {
    console.error("Error registrando afiliado:", error);
    return NextResponse.json(
      { error: "Error al registrar afiliado" },
      { status: 500 }
    );
  }
}

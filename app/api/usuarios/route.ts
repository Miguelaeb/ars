// app/api/usuarios/route.ts
import { NextResponse } from "next/server";
import { getUsers } from "@/lib/db-service";

export async function GET() {
  try {
    const users = await getUsers();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener los usuarios" },
      { status: 500 }
    );
  }
}

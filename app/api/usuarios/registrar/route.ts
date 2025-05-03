// app/api/usuarios/registrar/route.ts
import { NextResponse } from "next/server";
import { addUser } from "@/lib/db-service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newUser = await addUser(body);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al registrar el usuario" },
      { status: 500 }
    );
  }
}

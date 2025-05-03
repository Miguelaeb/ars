// app/api/usuarios/[id]/delete/route.ts
import { deleteUser } from "@/lib/db-service";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const success = await deleteUser(params.id);
    return new Response(JSON.stringify({ success }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Error al deshabilitar usuario" }),
      { status: 500 }
    );
  }
}

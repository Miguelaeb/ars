"use server";

import {
  createAutorizacion as createAutorizacionDB,
  updateAutorizacionStatus as updateAutorizacionStatusDB,
} from "@/lib/mysql-service";
import type { Autorizacion } from "@/lib/types";

export async function createAutorizacion(data: {
  afiliadoId: string;
  tipoServicio: string;
  prestador: string;
  medicoTratante?: string;
  fechaServicio: string;
  descripcion: string;
  montoEstimado: number;
  urgencia: "normal" | "urgente" | "emergencia";
  porcentajeCobertura: number;
  copago: number;
  montoMaximo: number;
  requiereAutorizacion: boolean;
  estado: string;
  comentarios?: string;
  documentos?: any;
}): Promise<{
  success: boolean;
  message: string;
  autorizacion?: Autorizacion;
}> {
  try {
    const nuevaAutorizacion = {
      ...data,
      documentos: data.documentos ?? {},
    };

    const autorizacion = await createAutorizacionDB(nuevaAutorizacion);

    return {
      success: true,
      message: `Autorización registrada exitosamente con número ${autorizacion.numeroAutorizacion}`,
      autorizacion,
    };
  } catch (error) {
    console.error("Error al crear autorización:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error al procesar la solicitud de autorización",
    };
  }
}

export async function updateAutorizacionStatus(
  formData: FormData
): Promise<{ success: boolean; message: string; autorizacion?: Autorizacion }> {
  try {
    const id = formData.get("id") as string;
    const estado = formData.get("estado") as
      | "pendiente"
      | "aprobada"
      | "rechazada";
    const comentarios = formData.get("comentarios") as string;

    if (!id) {
      return { success: false, message: "ID de autorización no proporcionado" };
    }

    if (!estado) {
      return { success: false, message: "Estado no proporcionado" };
    }

    // Actualizar el estado de la autorización usando el servicio MySQL directo
    const autorizacion = await updateAutorizacionStatusDB(
      id,
      estado,
      comentarios
    );

    if (!autorizacion) {
      return { success: false, message: "Autorización no encontrada" };
    }

    return {
      success: true,
      message: `Autorización ${autorizacion.numeroAutorizacion} ${
        estado === "aprobada" ? "aprobada" : "rechazada"
      } exitosamente`,
      autorizacion,
    };
  } catch (error) {
    console.error("Error al actualizar estado de autorización:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error al procesar la solicitud",
    };
  }
}

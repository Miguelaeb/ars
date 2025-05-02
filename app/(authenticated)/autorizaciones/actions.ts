"use server"

import {
  createAutorizacion as createAutorizacionDB,
  updateAutorizacionStatus as updateAutorizacionStatusDB,
} from "@/lib/mysql-service"
import type { Autorizacion } from "@/lib/types"

export async function createAutorizacion(
  formData: FormData,
): Promise<{ success: boolean; message: string; autorizacion?: Autorizacion }> {
  try {
    // Extraer datos del formulario
    const afiliadoId = formData.get("afiliadoId") as string
    const tipoServicio = formData.get("tipoServicio") as string
    const prestador = formData.get("prestador") as string
    const medicoTratante = formData.get("medicoTratante") as string
    const fechaServicio = formData.get("fechaServicio") as string
    const descripcion = formData.get("descripcion") as string
    const montoEstimado = Number.parseFloat(formData.get("montoEstimado") as string) || 0
    const urgencia = formData.get("urgencia") as "normal" | "urgente" | "emergencia"
    const porcentajeCobertura = Number.parseFloat(formData.get("porcentajeCobertura") as string) || 0
    const copago = Number.parseFloat(formData.get("copago") as string) || 0
    const montoMaximo = Number.parseFloat(formData.get("montoMaximo") as string) || 0
    const requiereAutorizacion = (formData.get("requiereAutorizacion") as string) === "true"

    // Validar datos requeridos
    if (!afiliadoId) {
      return { success: false, message: "El ID del afiliado es requerido" }
    }

    if (!tipoServicio) {
      return { success: false, message: "El tipo de servicio es requerido" }
    }

    if (!prestador) {
      return { success: false, message: "El prestador de servicio es requerido" }
    }

    if (!fechaServicio) {
      return { success: false, message: "La fecha del servicio es requerida" }
    }

    if (!descripcion) {
      return { success: false, message: "La descripción del servicio es requerida" }
    }

    // Crear objeto de autorización
    const nuevaAutorizacion = {
      afiliadoId,
      tipoServicio,
      prestador,
      medicoTratante,
      fechaServicio,
      descripcion,
      montoEstimado,
      urgencia: urgencia || "normal",
      porcentajeCobertura,
      copago,
      montoMaximo,
      requiereAutorizacion,
      estado: "pendiente",
      documentos: {
        indicacionMedica: (formData.get("indicacionMedica") as string) || undefined,
        resultadosPrevios: (formData.get("resultadosPrevios") as string) || undefined,
        otrosDocumentos: (formData.get("otrosDocumentos") as string) || undefined,
      },
    }

    // Guardar en la base de datos usando el servicio MySQL directo
    const autorizacion = await createAutorizacionDB(nuevaAutorizacion)

    return {
      success: true,
      message: `Autorización registrada exitosamente con número ${autorizacion.numeroAutorizacion}`,
      autorizacion,
    }
  } catch (error) {
    console.error("Error al crear autorización:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error al procesar la solicitud de autorización",
    }
  }
}

export async function updateAutorizacionStatus(
  formData: FormData,
): Promise<{ success: boolean; message: string; autorizacion?: Autorizacion }> {
  try {
    const id = formData.get("id") as string
    const estado = formData.get("estado") as "pendiente" | "aprobada" | "rechazada"
    const comentarios = formData.get("comentarios") as string

    if (!id) {
      return { success: false, message: "ID de autorización no proporcionado" }
    }

    if (!estado) {
      return { success: false, message: "Estado no proporcionado" }
    }

    // Actualizar el estado de la autorización usando el servicio MySQL directo
    const autorizacion = await updateAutorizacionStatusDB(id, estado, comentarios)

    if (!autorizacion) {
      return { success: false, message: "Autorización no encontrada" }
    }

    return {
      success: true,
      message: `Autorización ${autorizacion.numeroAutorizacion} ${
        estado === "aprobada" ? "aprobada" : "rechazada"
      } exitosamente`,
      autorizacion,
    }
  } catch (error) {
    console.error("Error al actualizar estado de autorización:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error al procesar la solicitud",
    }
  }
}

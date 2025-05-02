"use server"

import { revalidatePath } from "next/cache"
import { createFactura as createFacturaDB, updateFacturaStatus as updateFacturaStatusDB } from "@/lib/mysql-service"

export async function createFactura(formData: FormData): Promise<{ success: boolean; message: string }> {
  try {
    // Extract data from FormData
    const autorizacionId = formData.get("autorizacionId") as string
    const prestadorId = formData.get("prestadorId") as string
    const numeroFactura = formData.get("numeroFactura") as string
    const fechaEmision = formData.get("fechaEmision") as string
    const fechaRecepcion = formData.get("fechaRecepcion") as string
    const montoTotal = Number(formData.get("montoTotal") as string)
    const estado = formData.get("estado") as string
    const montoPagado = Number(formData.get("montoPagado") as string)
    const comentarios = formData.get("comentarios") as string

    // Basic validation
    if (!autorizacionId || !numeroFactura || !fechaEmision || !fechaRecepcion || !montoTotal || !estado) {
      return { success: false, message: "Missing required fields" }
    }

    // Crear la factura en la base de datos usando el servicio MySQL directo
    await createFacturaDB({
      autorizacionId,
      prestadorId,
      numeroFactura,
      fechaEmision,
      fechaRecepcion,
      montoTotal,
      estado,
      montoPagado,
      comentarios,
    })

    // Revalidar la ruta para actualizar los datos
    revalidatePath("/facturacion/lista")
    return { success: true, message: "Factura created successfully" }
  } catch (error) {
    console.error("Error creating factura:", error)
    return { success: false, message: error instanceof Error ? error.message : "Failed to create factura" }
  }
}

export async function updateFacturaStatus(formData: FormData): Promise<{ success: boolean; message: string }> {
  try {
    const facturaId = formData.get("facturaId") as string
    const estado = formData.get("estado") as string
    const comentarios = formData.get("comentarios") as string

    if (!facturaId || !estado) {
      return { success: false, message: "Missing required fields" }
    }

    // Actualizar el estado de la factura en la base de datos usando el servicio MySQL directo
    await updateFacturaStatusDB(facturaId, estado, undefined, undefined, undefined, comentarios)

    revalidatePath("/facturacion/lista")
    return { success: true, message: "Factura status updated successfully" }
  } catch (error) {
    console.error("Error updating factura status:", error)
    return { success: false, message: error instanceof Error ? error.message : "Failed to update factura status" }
  }
}

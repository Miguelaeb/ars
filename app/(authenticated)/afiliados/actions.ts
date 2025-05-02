"use server"

import { createAfiliado, createDependientes } from "@/lib/mysql-service"
import { revalidatePath } from "next/cache"

export async function registrarAfiliado(formData: FormData) {
  try {
    console.log("Server action: registrarAfiliado called")

    // Extract form data
    const nombres = formData.get("nombres") as string
    const apellidos = formData.get("apellidos") as string
    const cedula = formData.get("cedula") as string
    const fechaNacimiento = formData.get("fechaNacimiento") as string
    const genero = formData.get("genero") as string
    const nss = formData.get("nss") as string
    const estadoCivil = formData.get("estadoCivil") as string
    const nacionalidad = formData.get("nacionalidad") as string
    const telefono = formData.get("telefono") as string
    const celular = formData.get("celular") as string
    const email = formData.get("email") as string
    const direccion = formData.get("direccion") as string
    const provincia = formData.get("provincia") as string
    const municipio = formData.get("municipio") as string
    const sector = formData.get("sector") as string
    const codigoPostal = formData.get("codigoPostal") as string
    const plan = formData.get("plan") as string
    const tipoAfiliado = formData.get("tipoAfiliado") as string
    const empleador = formData.get("empleador") as string
    const fechaAfiliacion = formData.get("fechaAfiliacion") as string
    const formaPago = formData.get("formaPago") as string
    const estado = formData.get("estado") as string
    const coberturaDental = formData.get("coberturaDental") === "true"
    const coberturaVision = formData.get("coberturaVision") === "true"
    const coberturaInternacional = formData.get("coberturaInternacional") === "true"
    const coberturaMedicamentos = formData.get("coberturaMedicamentos") === "true"
    const observaciones = formData.get("observaciones") as string

    // Get dependientes from JSON string
    const dependientesStr = formData.get("dependientes") as string
    const dependientes = dependientesStr ? JSON.parse(dependientesStr) : []

    // Create afiliado object
    const afiliado = {
      nombres,
      apellidos,
      cedula,
      fechaNacimiento,
      genero,
      nss,
      estadoCivil,
      nacionalidad,
      telefono,
      celular,
      email,
      direccion,
      provincia,
      municipio,
      sector,
      codigoPostal,
      plan,
      tipoAfiliado,
      empleador,
      fechaAfiliacion,
      formaPago,
      estado,
      coberturaDental,
      coberturaVision,
      coberturaInternacional,
      coberturaMedicamentos,
      observaciones,
    }

    console.log("Creating affiliate with data:", afiliado)

    // Save to database using the direct MySQL service
    const newAfiliado = await createAfiliado(afiliado)

    // If there are dependientes, save them too
    if (dependientes.length > 0) {
      await createDependientes(newAfiliado.id, dependientes)
    }

    // Revalidate the affiliates path to refresh the data
    revalidatePath("/afiliados")
    revalidatePath("/afiliados/consulta")

    return {
      success: true,
      message: "Afiliado registrado exitosamente",
      afiliado: newAfiliado,
    }
  } catch (error) {
    console.error("Error registering affiliate:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error al registrar afiliado",
    }
  }
}

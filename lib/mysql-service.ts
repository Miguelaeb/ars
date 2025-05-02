// Aseguramos que este código solo se ejecute en el servidor
"use server";

import type { RowDataPacket, OkPacket, ResultSetHeader } from "mysql2/promise";

export async function executeQuery<T>({
  query,
  values,
}: {
  query: string;
  values?: any[];
}): Promise<T> {
  try {
    const mysql = await import("mysql2/promise");

    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || "localhost",
      database: process.env.MYSQL_DATABASE || "ars",
      user: process.env.MYSQL_USER || "root",
      password: process.env.MYSQL_PASSWORD || "admin123",
      port: Number.parseInt(process.env.MYSQL_PORT || "3306"),
    });

    const [results] = await connection.execute(query, values);
    await connection.end();
    return results as T;
  } catch (error) {
    console.error("Error executing MySQL query:", error);
    throw error;
  }
}

export type QueryResult =
  | RowDataPacket[]
  | RowDataPacket[][]
  | OkPacket
  | OkPacket[]
  | ResultSetHeader;

export async function getAfiliados() {
  try {
    return await executeQuery<RowDataPacket[]>({
      query:
        "SELECT *, id_afiliado AS id FROM afiliados ORDER BY created_at DESC",
    });
  } catch (error) {
    console.error("Error getting afiliados:", error);
    return [];
  }
}

export async function getAfiliadoById(id: string) {
  try {
    const afiliados = await executeQuery<RowDataPacket[]>({
      query: "SELECT *, id_afiliado AS id FROM afiliados WHERE id_afiliado = ?",
      values: [id],
    });
    return afiliados.length > 0 ? afiliados[0] : null;
  } catch (error) {
    console.error(`Error getting afiliado with ID ${id}:`, error);
    return null;
  }
}

export async function getAfiliadoByCedula(cedula: string) {
  try {
    const afiliados = await executeQuery<RowDataPacket[]>({
      query: "SELECT * FROM afiliados WHERE cedula = ?",
      values: [cedula],
    });
    return afiliados.length > 0 ? afiliados[0] : null;
  } catch (error) {
    console.error(`Error getting afiliado with cedula ${cedula}:`, error);
    return null;
  }
}

export async function createAfiliado(afiliado: any) {
  try {
    const result = await executeQuery<ResultSetHeader>({
      query: `
        INSERT INTO afiliados 
        (nombres, apellidos, cedula, fecha_nacimiento, genero, nss, estado_civil, nacionalidad, 
         telefono, celular, email, direccion, provincia, municipio, sector, codigo_postal, 
         plan, tipo_afiliado, empleador, fecha_afiliacion, forma_pago, estado, 
         cobertura_dental, cobertura_vision, cobertura_internacional, cobertura_medicamentos, observaciones)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      values: [
        afiliado.nombres || null,
        afiliado.apellidos || null,
        afiliado.cedula || null,
        afiliado.fechaNacimiento ? afiliado.fechaNacimiento : null,
        afiliado.genero || null,
        afiliado.nss || null,
        afiliado.estadoCivil || null,
        afiliado.nacionalidad || null,
        afiliado.telefono || null,
        afiliado.celular || null,
        afiliado.email || null,
        afiliado.direccion || null,
        afiliado.provincia || null,
        afiliado.municipio || null,
        afiliado.sector || null,
        afiliado.codigoPostal || null,
        afiliado.plan || null,
        afiliado.tipoAfiliado || null,
        afiliado.empleador || null,
        afiliado.fechaAfiliacion || null,
        afiliado.formaPago || null,
        afiliado.estado || null,
        afiliado.coberturaDental ? 1 : 0,
        afiliado.coberturaVision ? 1 : 0,
        afiliado.coberturaInternacional ? 1 : 0,
        afiliado.coberturaMedicamentos ? 1 : 0,
        afiliado.observaciones || null,
      ],
    });

    return {
      id_afiliado: result.insertId.toString(),
      ...afiliado,
      id: result.insertId.toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error creating afiliado:", error);
    throw error;
  }
}

export async function updateAfiliado(id: string, afiliado: any) {
  try {
    await executeQuery<ResultSetHeader>({
      query: `
        UPDATE afiliados SET
          nombres = ?,
          apellidos = ?,
          cedula = ?,
          fecha_nacimiento = ?,
          genero = ?,
          nss = ?,
          estado_civil = ?,
          nacionalidad = ?,
          telefono = ?,
          celular = ?,
          email = ?,
          direccion = ?,
          provincia = ?,
          municipio = ?,
          sector = ?,
          codigo_postal = ?,
          plan = ?,
          tipo_afiliado = ?,
          empleador = ?,
          fecha_afiliacion = ?,
          forma_pago = ?,
          estado = ?,
          cobertura_dental = ?,
          cobertura_vision = ?,
          cobertura_internacional = ?,
          cobertura_medicamentos = ?,
          observaciones = ?
        WHERE id_afiliado = ?
      `,
      values: [
        afiliado.nombres,
        afiliado.apellidos,
        afiliado.cedula,
        afiliado.fechaNacimiento,
        afiliado.genero,
        afiliado.nss,
        afiliado.estadoCivil,
        afiliado.nacionalidad,
        afiliado.telefono,
        afiliado.celular,
        afiliado.email,
        afiliado.direccion,
        afiliado.provincia,
        afiliado.municipio,
        afiliado.sector,
        afiliado.codigoPostal,
        afiliado.plan,
        afiliado.tipoAfiliado,
        afiliado.empleador,
        afiliado.fechaAfiliacion,
        afiliado.formaPago,
        afiliado.estado,
        afiliado.coberturaDental ? 1 : 0,
        afiliado.coberturaVision ? 1 : 0,
        afiliado.coberturaInternacional ? 1 : 0,
        afiliado.coberturaMedicamentos ? 1 : 0,
        afiliado.observaciones,
        id,
      ],
    });
  } catch (error) {
    console.error(`Error updating afiliado with ID ${id}:`, error);
    throw error;
  }
}

export async function deleteAfiliado(id: string) {
  try {
    await executeQuery<ResultSetHeader>({
      query: "DELETE FROM dependientes WHERE afiliado_id = ?",
      values: [id],
    });

    await executeQuery<ResultSetHeader>({
      query: "DELETE FROM afiliados WHERE id_afiliado = ?",
      values: [id],
    });

    return true;
  } catch (error) {
    console.error(`Error deleting afiliado with ID ${id}:`, error);
    throw error;
  }
}

export async function createDependientes(
  afiliadoId: string,
  dependientes: any[]
) {
  try {
    for (const dependiente of dependientes) {
      await executeQuery<ResultSetHeader>({
        query: `
          INSERT INTO dependientes 
          (afiliado_id, nombre, apellido, cedula, fecha_nacimiento, genero, parentesco, telefono_contacto)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        values: [
          afiliadoId,
          dependiente.nombre || null,
          dependiente.apellido || null,
          dependiente.cedula || null,
          dependiente.fechaNacimiento || null,
          dependiente.genero || null,
          dependiente.parentesco || null,
          dependiente.telefono || null,
        ],
      });
    }

    return true;
  } catch (error) {
    console.error("Error creating dependientes:", error);
    throw error;
  }
}

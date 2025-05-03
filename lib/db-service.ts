import mysql from "serverless-mysql";

// Configuración de la conexión a MySQL
const db = mysql({
  config: {
    host: process.env.MYSQL_HOST || "localhost",
    database: process.env.MYSQL_DATABASE || "ars",
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "admin123",
    port: Number.parseInt(process.env.MYSQL_PORT || "3306"),
  },
});

// Función para ejecutar consultas SQL
export async function executeQuery({
  query,
  values,
}: {
  query: string;
  values?: any[];
}) {
  try {
    const results = await db.query(query, values);
    await db.end();
    return results;
  } catch (error) {
    console.error("Error executing MySQL query:", error);
    throw error;
  }
}

// Función para mapear nombres de columnas de la base de datos a nombres de propiedades en el código
// Esto permite flexibilidad si los nombres de columnas son diferentes
export function mapDbToModel(dbRecord: any, mapping: Record<string, string>) {
  const result: Record<string, any> = {};

  for (const [modelKey, dbKey] of Object.entries(mapping)) {
    if (dbKey in dbRecord) {
      result[modelKey] = dbRecord[dbKey];
    }
  }

  return result;
}

// Función para mapear nombres de propiedades en el código a nombres de columnas en la base de datos
export function mapModelToDb(model: any, mapping: Record<string, string>) {
  const result: Record<string, any> = {};

  for (const [modelKey, dbKey] of Object.entries(mapping)) {
    if (modelKey in model) {
      result[dbKey] = model[modelKey];
    }
  }

  return result;
}

// Clase de servicio de base de datos que usa MySQL
export class DbService {
  private static instance: DbService;

  private constructor() {}

  public static getInstance(): DbService {
    if (!DbService.instance) {
      DbService.instance = new DbService();
    }
    return DbService.instance;
  }

  // Afiliados
  public async getAfiliados(): Promise<any[]> {
    try {
      const results = await executeQuery({
        query: "SELECT * FROM afiliados",
      });

      return Array.isArray(results) ? results : [];
    } catch (error) {
      console.error("Error getting affiliates:", error);
      return [];
    }
  }

  public async getAfiliadoById(id: string): Promise<any | null> {
    try {
      const results = await executeQuery({
        query: "SELECT * FROM afiliados WHERE id = ?",
        values: [id],
      });

      if (Array.isArray(results) && results.length > 0) {
        return results[0];
      }
      return null;
    } catch (error) {
      console.error("Error getting affiliate by ID:", error);
      return null;
    }
  }

  public async getAfiliadoByCedula(cedula: string): Promise<any | null> {
    try {
      const results = await executeQuery({
        query: "SELECT * FROM afiliados WHERE cedula = ?",
        values: [cedula],
      });

      if (Array.isArray(results) && results.length > 0) {
        return results[0];
      }
      return null;
    } catch (error) {
      console.error("Error getting affiliate by cedula:", error);
      return null;
    }
  }

  public async createAfiliado(afiliado: any): Promise<any> {
    try {
      const now = new Date().toISOString().slice(0, 19).replace("T", " ");
      const result = await executeQuery({
        query: `
          INSERT INTO afiliados (id, nombres, apellidos, cedula, fechaNacimiento, genero, nss, estadoCivil, nacionalidad, telefono, celular, email, direccion, provincia, municipio, sector, codigoPostal, plan, tipoAfiliado, empleador, fechaAfiliacion, formaPago, estado, coberturaDental, coberturaVision, coberturaInternacional, coberturaMedicamentos, observaciones, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        values: [
          crypto.randomUUID(),
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
          afiliado.coberturaDental,
          afiliado.coberturaVision,
          afiliado.coberturaInternacional,
          afiliado.coberturaMedicamentos,
          afiliado.observaciones,
          now,
          now,
        ],
      });
      return { id: result.insertId, ...afiliado };
    } catch (error) {
      console.error("Error creating affiliate:", error);
      throw error;
    }
  }

  // Dependientes
  public async getDependientes(afiliadoId: string): Promise<any[]> {
    try {
      const results = await executeQuery({
        query: "SELECT * FROM dependientes WHERE afiliadoId = ?",
        values: [afiliadoId],
      });

      return Array.isArray(results) ? results : [];
    } catch (error) {
      console.error("Error getting dependents:", error);
      return [];
    }
  }

  public async createDependientes(
    afiliadoId: string,
    dependientes: any[]
  ): Promise<any[]> {
    try {
      const now = new Date().toISOString().slice(0, 19).replace("T", " ");
      const createdDependientes = [];
      for (const dependiente of dependientes) {
        const result = await executeQuery({
          query: `
            INSERT INTO dependientes (id, afiliadoId, nombres, apellidos, cedula, fechaNacimiento, genero, parentesco, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          values: [
            crypto.randomUUID(),
            afiliadoId,
            dependiente.nombre,
            dependiente.apellido,
            dependiente.cedula,
            dependiente.fechaNacimiento,
            dependiente.genero,
            dependiente.parentesco,
            now,
            now,
          ],
        });
        createdDependientes.push({ id: result.insertId, ...dependiente });
      }
      return createdDependientes;
    } catch (error) {
      console.error("Error creating dependents:", error);
      throw error;
    }
  }

  // Autorizaciones
  public async getAutorizaciones(): Promise<any[]> {
    try {
      const results = await executeQuery({
        query: "SELECT * FROM autorizaciones",
      });

      return Array.isArray(results) ? results : [];
    } catch (error) {
      console.error("Error getting authorizations:", error);
      return [];
    }
  }

  public async getAutorizacionById(id: string): Promise<any | null> {
    try {
      const results = await executeQuery({
        query: "SELECT * FROM autorizaciones WHERE id = ?",
        values: [id],
      });

      if (Array.isArray(results) && results.length > 0) {
        return results[0];
      }
      return null;
    } catch (error) {
      console.error("Error getting authorization by ID:", error);
      return null;
    }
  }

  public async getAutorizacionesByEstado(estado: string): Promise<any[]> {
    try {
      const results = await executeQuery({
        query: "SELECT * FROM autorizaciones WHERE estado = ?",
        values: [estado],
      });

      return Array.isArray(results) ? results : [];
    } catch (error) {
      console.error("Error getting authorizations by status:", error);
      return [];
    }
  }

  public async createAutorizacion(autorizacion: any): Promise<any> {
    try {
      const now = new Date().toISOString().slice(0, 19).replace("T", " ");
      const result = await executeQuery({
        query: `
          INSERT INTO autorizaciones (id, afiliadoId, numeroAutorizacion, tipoServicio, prestador, medicoTratante, fechaServicio, descripcion, montoEstimado, urgencia, porcentajeCobertura, copago, montoMaximo, requiereAutorizacion, estado, documentos, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        values: [
          crypto.randomUUID(),
          autorizacion.afiliadoId,
          this.generateNumeroAutorizacion(),
          autorizacion.tipoServicio,
          autorizacion.prestador,
          autorizacion.medicoTratante,
          autorizacion.fechaServicio,
          autorizacion.descripcion,
          autorizacion.montoEstimado,
          autorizacion.urgencia,
          autorizacion.porcentajeCobertura,
          autorizacion.copago,
          autorizacion.montoMaximo,
          autorizacion.requiereAutorizacion,
          autorizacion.estado,
          JSON.stringify(autorizacion.documentos),
          now,
          now,
        ],
      });
      return { id: result.insertId, ...autorizacion };
    } catch (error) {
      console.error("Error creating authorization:", error);
      throw error;
    }
  }

  public async updateAutorizacionStatus(
    id: string,
    estado: string,
    comentarios: string
  ): Promise<any | null> {
    try {
      const now = new Date().toISOString().slice(0, 19).replace("T", " ");
      await executeQuery({
        query:
          "UPDATE autorizaciones SET estado = ?, comentarios = ?, updatedAt = ? WHERE id = ?",
        values: [estado, comentarios, now, id],
      });
      return { id, estado, comentarios, updatedAt: now };
    } catch (error) {
      console.error("Error updating authorization status:", error);
      return null;
    }
  }

  // Facturas
  public async getFacturas(): Promise<any[]> {
    try {
      const results = await executeQuery({
        query: "SELECT * FROM facturas",
      });

      return Array.isArray(results) ? results : [];
    } catch (error) {
      console.error("Error getting invoices:", error);
      return [];
    }
  }

  public async getFacturaById(id: string): Promise<any | null> {
    try {
      const results = await executeQuery({
        query: "SELECT * FROM facturas WHERE id = ?",
        values: [id],
      });

      if (Array.isArray(results) && results.length > 0) {
        return results[0];
      }
      return null;
    } catch (error) {
      console.error("Error getting invoice by ID:", error);
      return null;
    }
  }

  public async getFacturasByAutorizacionId(
    autorizacionId: string
  ): Promise<any[]> {
    try {
      const results = await executeQuery({
        query: "SELECT * FROM facturas WHERE autorizacionId = ?",
        values: [autorizacionId],
      });

      return Array.isArray(results) ? results : [];
    } catch (error) {
      console.error("Error getting invoices by authorization ID:", error);
      return [];
    }
  }

  public async createFactura(factura: any): Promise<any> {
    try {
      const now = new Date().toISOString().slice(0, 19).replace("T", " ");
      const result = await executeQuery({
        query: `
          INSERT INTO facturas (id, autorizacionId, prestadorId, numeroFactura, fechaEmision, fechaRecepcion, montoTotal, estado, montoPagado, comentarios, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        values: [
          crypto.randomUUID(),
          factura.autorizacionId,
          factura.prestadorId,
          factura.numeroFactura,
          factura.fechaEmision,
          factura.fechaRecepcion,
          factura.montoTotal,
          factura.estado,
          factura.montoPagado,
          factura.comentarios,
          now,
          now,
        ],
      });
      return { id: result.insertId, ...factura };
    } catch (error) {
      console.error("Error creating invoice:", error);
      throw error;
    }
  }

  public async updateFacturaStatus(
    id: string,
    estado: string,
    montoPagado?: number,
    metodoPago?: string,
    fechaPago?: string,
    comentarios?: string
  ): Promise<any | null> {
    try {
      const now = new Date().toISOString().slice(0, 19).replace("T", " ");

      let query = "UPDATE facturas SET estado = ?, updatedAt = ?";
      const values: any[] = [estado, now, id];

      if (montoPagado !== undefined) {
        query += ", montoPagado = ?";
        values.unshift(montoPagado);
      }

      if (metodoPago) {
        query += ", metodoPago = ?";
        values.unshift(metodoPago);
      }

      if (fechaPago) {
        query += ", fechaPago = ?";
        values.unshift(fechaPago);
      }

      if (comentarios) {
        query += ", comentarios = ?";
        values.unshift(comentarios);
      }

      query += " WHERE id = ?";

      await executeQuery({
        query,
        values,
      });

      return {
        id,
        estado,
        montoPagado,
        metodoPago,
        fechaPago,
        comentarios,
        updatedAt: now,
      };
    } catch (error) {
      console.error("Error updating invoice status:", error);
      return null;
    }
  }

  // Usuarios

  public async getUsers(): Promise<any[]> {
    try {
      const results = await executeQuery({
        query: "SELECT * FROM usuarios",
      });

      return Array.isArray(results) ? results : [];
    } catch (error) {
      console.error("Error getting users:", error);
      return [];
    }
  }

  public async getUserById(id: string): Promise<any | null> {
    try {
      const results = await executeQuery({
        query: "SELECT * FROM usuarios WHERE id = ?",
        values: [id],
      });

      if (Array.isArray(results) && results.length > 0) {
        return results[0];
      }
      return null;
    } catch (error) {
      console.error("Error getting user by ID:", error);
      return null;
    }
  }

  public async getUserByEmail(email: string): Promise<any | null> {
    try {
      const results = await executeQuery({
        query: "SELECT * FROM usuarios WHERE email = ?",
        values: [email],
      });

      if (Array.isArray(results) && results.length > 0) {
        return results[0];
      }
      return null;
    } catch (error) {
      console.error("Error getting user by email:", error);
      return null;
    }
  }

  public async authenticateUser(
    email: string,
    password: string
  ): Promise<any | null> {
    try {
      const results = await executeQuery({
        query:
          'SELECT * FROM usuarios WHERE email = ? AND password = ? AND status = "active"',
        values: [email, password],
      });

      if (Array.isArray(results) && results.length > 0) {
        return results[0];
      }
      return null;
    } catch (error) {
      console.error("Error authenticating user:", error);
      return null;
    }
  }

  public async addUser(user: any): Promise<any> {
    try {
      const now = new Date().toISOString().slice(0, 19).replace("T", " ");
      const result = await executeQuery({
        query: `
          INSERT INTO usuarios (id, name, email, password, role, department, position, status, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        values: [
          crypto.randomUUID(),
          user.name,
          user.email,
          user.password,
          user.role,
          user.department,
          user.position,
          user.status,
          now,
          now,
        ],
      });
      return { id: result.insertId, ...user };
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  public async updateUser(id: string, updates: any): Promise<any | null> {
    try {
      const now = new Date().toISOString().slice(0, 19).replace("T", " ");

      // Construye dinámicamente el query y los valores
      const fields: string[] = [];
      const values: any[] = [];

      if (updates.name) {
        fields.push("name = ?");
        values.push(updates.name);
      }
      if (updates.email) {
        fields.push("email = ?");
        values.push(updates.email);
      }
      if (updates.password) {
        fields.push("password = ?");
        values.push(updates.password);
      }
      if (updates.role) {
        fields.push("role = ?");
        values.push(updates.role);
      }
      if (updates.department) {
        fields.push("department = ?");
        values.push(updates.department);
      }
      if (updates.position) {
        fields.push("position = ?");
        values.push(updates.position);
      }
      if (updates.status) {
        fields.push("status = ?");
        values.push(updates.status);
      }

      // Agrega el campo updatedAt
      fields.push("updatedAt = ?");
      values.push(now);

      const query = `UPDATE usuarios SET ${fields.join(", ")} WHERE id = ?`;
      values.push(id); // id siempre al final

      await executeQuery({
        query,
        values,
      });

      const updatedUser = await this.getUserById(id);
      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      return null;
    }
  }

  public async deleteUser(id: string): Promise<boolean> {
    try {
      await executeQuery({
        query: 'UPDATE usuarios SET status = "inactive" WHERE id = ?',
        values: [id],
      });
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  }

  // Funciones auxiliares para mapear entre DB y modelo

  private generateNumeroAutorizacion(): string {
    // Formato: AUT-YYYYMMDD-XXXX donde XXXX es un número aleatorio de 4 dígitos
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const random = Math.floor(1000 + Math.random() * 9000); // Número aleatorio de 4 dígitos

    return `AUT-${year}${month}${day}-${random}`;
  }
}

// Exportar funciones de usuario para compatibilidad con el código existente
export const getUsers = async (): Promise<any[]> => {
  const dbService = DbService.getInstance();
  return dbService.getUsers();
};

export const getUserById = async (id: string): Promise<any | null> => {
  const dbService = DbService.getInstance();
  return dbService.getUserById(id);
};

export const getUserByEmail = async (email: string): Promise<any | null> => {
  const dbService = DbService.getInstance();
  return dbService.getUserByEmail(email);
};

export const authenticateUser = async (
  email: string,
  password: string
): Promise<any | null> => {
  const dbService = DbService.getInstance();
  return dbService.authenticateUser(email, password);
};

export const addUser = async (user: any): Promise<any> => {
  const dbService = DbService.getInstance();
  return dbService.addUser(user);
};

export const updateUser = async (
  id: string,
  updates: any
): Promise<any | null> => {
  const dbService = DbService.getInstance();
  return dbService.updateUser(id, updates);
};

export const deleteUser = async (id: string): Promise<boolean> => {
  const dbService = DbService.getInstance();
  return dbService.deleteUser(id);
};

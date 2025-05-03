export interface Afiliado {
  id: string;
  nombres: string;
  apellidos: string;
  cedula: string;
  fechaNacimiento: string;
  genero: string;
  nss: string;
  estadoCivil: string;
  nacionalidad: string;
  telefono: string;
  celular: string;
  email: string;
  direccion: string;
  provincia: string;
  municipio: string;
  sector: string;
  codigoPostal: string;
  plan: string;
  tipoAfiliado: string;
  empleador: string;
  fechaAfiliacion: string;
  formaPago: string;
  estado: string;
  coberturaDental: boolean;
  coberturaVision: boolean;
  coberturaInternacional: boolean;
  coberturaMedicamentos: boolean;
  observaciones: string;
  createdAt: string;
  updatedAt: string;
}

export interface Dependiente {
  id: string;
  afiliadoId: string;
  nombre: string;
  apellido: string;
  cedula: string;
  fechaNacimiento: string;
  genero: string;
  parentesco: string;
  createdAt: string;
  updatedAt: string;
}

export interface Autorizacion {
  id: string;
  numeroAutorizacion: string;
  afiliadoId: number;
  tipoServicio: string;
  prestador: string;
  medicoTratante: string;
  fechaServicio: string;
  descripcion: string;
  montoEstimado: number;
  urgencia: string;
  porcentajeCobertura: number;
  copago: number;
  montoMaximo: number;
  requiereAutorizacion: boolean;
  estado: string;
  comentarios?: string;
  documentos?: any[];
}

export interface Factura {
  id: string;
  numeroFactura: string;
  autorizacionId: string;
  prestadorId: string;
  fechaEmision: string;
  fechaRecepcion: string;
  montoTotal: number;
  montoPagado: number;
  estado: "pendiente" | "pagada" | "pago_parcial" | "rechazada" | "en_revision";
  metodoPago?: string;
  fechaPago?: string;
  comentarios?: string;
  documentos?: {
    facturaEscaneada?: string;
    documentosSoporte?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

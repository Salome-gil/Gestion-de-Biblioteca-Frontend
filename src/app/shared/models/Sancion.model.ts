/**
 * Modelo para la entidad Sanción
 */
export interface Sancion {
  id_sancion: string;
  id: string; // Alias
  id_biblioteca: string; //relacion con biblioteca
  motivo: string;
  fecha_sancion: string;
  monto: number;
  cod_cliente: string;
  fecha_creacion: string;
  fecha_edicion?: string;
  biblioteca?: { nombre: string };
  cliente?: { nombre: string };
}

/**
 * Modelo para crear una nueva sanción
 */
export interface CreateSancionRequest {
  id_biblioteca: string;
  motivo: string;
  fecha_sancion: string;
  monto: number;
  cod_cliente: string;
}

/**
 * Modelo para actualizar una sanción
 */
export interface UpdateSancionRequest {
  motivo?: string;
  fecha_sancion?: string;
  monto?: number;
  cod_cliente?: string;
}

/**
 * Modelo para filtros de sanción
 */
export interface SancionFilters {
  id_biblioteca?: string;
  cod_cliente?: string;
  fecha_sancion?: string;
}

/**
 * Modelo para respuesta paginada de sanciones
 */
export interface SancionListResponse {
  data: Sancion[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

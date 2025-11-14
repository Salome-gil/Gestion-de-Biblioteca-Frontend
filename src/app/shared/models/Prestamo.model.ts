/**
 * Modelo para la entidad Préstamo
 */
export interface Prestamo {
  id: string;
  id_biblioteca: string;
  fecha_prestamo: string;
  fecha_entrega: string;
  id_material: string; //relacion con material
  cod_cliente: string; //relacion con cliente
  fecha_creacion: string;
  fecha_edicion?: string;
  biblioteca?: { nombre: string };
  material?: { titulo: string };
  cliente?: { nombre: string };
}

/**
 * Modelo para crear un nuevo préstamo
 */
export interface CreatePrestamoRequest {
  id_biblioteca: string;
  fecha_prestamo: string;
  fecha_entrega: string;
  id_material: string;
  cod_cliente: string;
}

/**
 * Modelo para actualizar un préstamo
 */
export interface UpdatePrestamoRequest {
  fecha_prestamo?: string;
  fecha_entrega?: string;
  id_material?: string;
  cod_cliente?: string;
}

/**
 * Modelo para filtros de préstamos
 */
export interface PrestamoFilters {
  id_biblioteca?: string;
  cod_cliente?: string;
  id_material?: string;
  fecha_prestamo?: string;
}

/**
 * Modelo para respuesta paginada de préstamos
 */
export interface PrestamoListResponse {
  data: Prestamo[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

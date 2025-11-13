/**
 * 🧾 Modelo principal de Reserva
 * Coincide con el modelo del backend (schemas.ReservaResponse)
 */
export interface Reserva {
  id_reserva: string;
  id: string;
  id_biblioteca: string; // relacion con biblioteca
  fecha_reserva: string; 
  estado: string; 
  cod_cliente: string; // relacion con cliente
  id_material: string; //relacion con material
  fecha_creacion: string;
  fecha_edicion?: string;
  biblioteca?: { nombre: string };
  material?: { titulo: string };
  cliente?: { nombre: string };
}

/**
 *  Modelo para crear una nueva reserva
 */
export interface CreateReservaRequest {
  id_biblioteca: string;
  fecha_reserva: string; 
  estado: string;
  cod_cliente: string;
  id_material: string; 
}

/**
 *  Modelo para actualizar una reserva existente
 
 */
export interface UpdateReservaRequest {
  fecha_reserva?: string;
  estado?: string;
  cod_cliente?: string;
  id_material?: string;
}

/**
 * Filtros para búsqueda de reservas
 */
export interface ReservaFilters {
  id_biblioteca?: string;
  cod_cliente?: string;
  id_material?: string;
  estado?: string;
  fecha_reserva?: string;
}

/**
 * Modelo para respuesta paginada del backend
 */
export interface ReservaListResponse {
  data: Reserva[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

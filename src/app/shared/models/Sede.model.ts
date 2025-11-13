/**
 * Modelo para la entidad Sede
 */
export interface Sede {
  id_sede: string;
  id: string; // Alias 
  nombre: string;
  direccion: string;
  fecha_creacion: string;
  fecha_edicion?: string;
}

/**
 * Modelo para crear una nueva sede
 */
export interface CreateSedeRequest {
  nombre: string;
  direccion: string;
}

/**
 * Modelo para actualizar una sede
 */
export interface UpdateSedeRequest {
  nombre?: string;
  direccion?: string;
}

/**
 * Modelo para filtros de sedes
 */
export interface SedeFilters {
  nombre?: string;
  direccion?: string;
}

/**
 * Modelo para respuesta paginada de sedes
 */
export interface SedeListResponse {
  data: Sede[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

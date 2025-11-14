/**
 * Modelo para la entidad Biblioteca
 */
export interface Biblioteca {
  id_biblioteca: string;
  id: string; // Alias 
  nombre: string;
  id_sede: string;
  fecha_creacion: string;
  fecha_edicion?: string;
  sede: {
    id_sede: string;
    nombre?: string; 
  };
}

/**
 * Modelo para crear una nueva biblioteca
 */
export interface CreateBibliotecaRequest {
  nombre: string;
  id_sede: string;
}

/**
 * Modelo para actualizar una biblioteca
 */
export interface UpdateBibliotecaRequest {
  nombre?: string;
  id_sede?: string;
}

/**
 * Modelo para filtros de búsqueda de bibliotecas
 */
export interface BibliotecaFilters {
  nombre?: string;
  id_sede?: string;
}

/**
 * Modelo para respuesta paginada de bibliotecas
 */
export interface BibliotecaListResponse {
  data: Biblioteca[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

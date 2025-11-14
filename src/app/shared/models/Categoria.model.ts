/**
 * Modelo para la entidad Categoría
 */
export interface Categoria {
  id_categoria: string;
  id: string; // Alias 
  id_biblioteca: string; // Relación con biblioteca
  nombre: string;
  descripcion?: string;
  fecha_creacion: string;
  fecha_edicion?: string;
  biblioteca?: {
    nombre: string;
  };
}

/**
 * Modelo para crear una nueva categoría
 */
export interface CreateCategoriaRequest {
  id_biblioteca: string;
  nombre: string;
  descripcion?: string;
}

/**
 * Modelo para actualizar una categoría
 */
export interface UpdateCategoriaRequest {
  id_biblioteca?: string;
  nombre?: string;
  descripcion?: string;
}

/**
 * Modelo para filtros de búsqueda de categorías
 */
export interface CategoriaFilters {
  nombre?: string;
  id_biblioteca?: string;
}

/**
 * Modelo para respuesta paginada de categorías
 */
export interface CategoriaListResponse {
  data: Categoria[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

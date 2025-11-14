/**
 * Modelo para la entidad Material
 */
export interface Material {
  id_material: string;
  id: string; // Alias 
  id_biblioteca: string;
  titulo: string;
  autor: string;
  estado: string;
  id_categoria: string; //relacion con categoria
  id_sede: string; //relacion con sede
  fecha_creacion: string;
  fecha_edicion?: string;
  biblioteca?: { nombre: string };
  categoria?: { nombre: string };
  sede?: {nombre:string};
}

/**
 * Modelo para crear un nuevo material
 */
export interface CreateMaterialRequest {
  id_biblioteca: string;
  titulo: string;
  autor: string;
  estado: string;
  id_categoria: string;
  id_sede: string
}

/**
 * Modelo para actualizar un material
 */
export interface UpdateMaterialRequest {
  id_biblioteca?: string;
  titulo?: string;
  autor?: string;
  estado?: string;
  id_categoria?: string;
  sede?: string;
}

/**
 * Modelo para filtros de materiales
 */
export interface MaterialFilters {
  titulo?: string;
  autor?: string;
  id_biblioteca?: string;
  id_categoria?: string;
  estado?: string;
}

/**
 * Modelo para respuesta paginada de materiales
 */
export interface MaterialListResponse {
  data: Material[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

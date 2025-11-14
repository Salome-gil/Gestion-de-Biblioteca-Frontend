/**
 * Modelo para la entidad Cliente
 */
export interface Cliente {
  codigo: string; 
  id: string; // Alias 
  nombre: string;
  tipo_cliente: string;
  detalle_tipo: string;
  vetado: boolean;
  id_biblioteca: string; // Relación con biblioteca
  fecha_creacion: string;
  fecha_edicion?: string;
  biblioteca?: {
    nombre: string;
  };
}

/**
 * Modelo para crear un nuevo cliente
 */
export interface CreateClienteRequest {
  nombre: string;
  tipo_cliente: string;
  detalle_tipo: string;
  vetado?: boolean;
  id_biblioteca: string;
}

/**
 * Modelo para actualizar un cliente
 */
export interface UpdateClienteRequest {
  nombre?: string;
  tipo_cliente?: string;
  detalle_tipo?: string;
  vetado?: boolean;
  id_biblioteca?: string;
}

/**
 * Modelo para filtros de clientes
 */
export interface ClienteFilters {
  nombre?: string;
  tipo_cliente?: string;
  id_biblioteca?: string;
  vetado?: boolean;
}

/**
 * Modelo para respuesta paginada de clientes
 */
export interface ClienteListResponse {
  data: Cliente[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreatePrestamoRequest, Prestamo, PrestamoFilters, UpdatePrestamoRequest } from '../../shared/models/Prestamo.model';
import { PaginationParams } from '../models/api-response.models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {
  private readonly endpoint = 'prestamos';

  constructor(private apiService: ApiService) { }

  
  getPrestamos(id_biblioteca: string, pagination: PaginationParams, filters?: PrestamoFilters): Observable<Prestamo[]> {
    return this.apiService.getPaginated<Prestamo>(`${this.endpoint}/${id_biblioteca}`, pagination, filters);
  }

  
  getPrestamoById(id_biblioteca: string, id_prestamo: string): Observable<Prestamo> {
    return this.apiService.get<Prestamo>(`${this.endpoint}/${id_biblioteca}/prestamo/${id_prestamo}`);
  }


  createPrestamo(prestamo: CreatePrestamoRequest): Observable<Prestamo> {
    return this.apiService.post<Prestamo>(this.endpoint, prestamo);
  }

  
  updatePrestamo(id_biblioteca: string, id_prestamo: string, prestamo: UpdatePrestamoRequest): Observable<Prestamo> {
    return this.apiService.put<Prestamo>(`${this.endpoint}/${id_biblioteca}/${id_prestamo}`, prestamo);
  }

  
  deletePrestamo(id_biblioteca: string, id_prestamo: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id_biblioteca}/${id_prestamo}`);
  }

  
  getPrestamosByCliente(id_biblioteca: string, cod_cliente: string): Observable<Prestamo[]> {
    return this.apiService.get<Prestamo[]>(`${this.endpoint}/${id_biblioteca}/cliente/${cod_cliente}`);
  }

  
  getPrestamosByMaterial(id_biblioteca: string, id_material: string): Observable<Prestamo[]> {
    return this.apiService.get<Prestamo[]>(`${this.endpoint}/${id_biblioteca}/material/${id_material}`);
  }
}

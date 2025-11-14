import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateSancionRequest, Sancion, SancionFilters, UpdateSancionRequest } from '../../shared/models/Sancion.model';
import { PaginationParams } from '../models/api-response.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class SancionService {
  private readonly endpoint = 'sanciones';

  constructor(private apiService: ApiService) { }

  
  getSanciones(id_biblioteca: string, pagination: PaginationParams, filters?: SancionFilters): Observable<Sancion[]> {
    return this.apiService.getPaginated<Sancion>(`${this.endpoint}/${id_biblioteca}`, pagination, filters);
  }

  
  getSancionById(id_biblioteca: string, id_sancion: string): Observable<Sancion> {
    return this.apiService.get<Sancion>(`${this.endpoint}/${id_biblioteca}/sancion/${id_sancion}`);
  }

  getSancionByFecha(id_biblioteca: string, Fecha_sancion: Date): Observable<Sancion> {
      return this.apiService.get<Sancion>(`${this.endpoint}/${id_biblioteca}/sancion/${Fecha_sancion}`);
  }

  getSancionByMonto(id_biblioteca: string, Monto: number): Observable<Sancion> {
    return this.apiService.get<Sancion>(`${this.endpoint}/${id_biblioteca}/sancion/${Monto}`);
  }

  getSancionByMotivo(id_biblioteca: string, Motivo: string): Observable<Sancion> {
    return this.apiService.get<Sancion>(`${this.endpoint}/${id_biblioteca}/sancion/${Motivo}`);
  }

  
  createSancion(sancion: CreateSancionRequest): Observable<Sancion> {
    return this.apiService.post<Sancion>(this.endpoint, sancion);
  }

  
  updateSancion(id_biblioteca: string, id_sancion: string, sancion: UpdateSancionRequest): Observable<Sancion> {
    return this.apiService.put<Sancion>(`${this.endpoint}/${id_biblioteca}/${id_sancion}`, sancion);
  }

  
  deleteSancion(id_biblioteca: string, id_sancion: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id_biblioteca}/${id_sancion}`);
  }

 
  getSancionesByCliente(id_biblioteca: string, cod_cliente: string): Observable<Sancion[]> {
    return this.apiService.get<Sancion[]>(`${this.endpoint}/${id_biblioteca}/cliente/${cod_cliente}`);
  }
}

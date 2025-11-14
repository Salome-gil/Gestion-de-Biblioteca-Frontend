import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateSedeRequest, Sede, SedeFilters, UpdateSedeRequest } from '../../shared/models/Sede.model';
import { PaginationParams } from '../models/api-response.models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class SedeService {
  private readonly endpoint = 'sedes';

  constructor(private apiService: ApiService) { }

  
  getSedes(pagination: PaginationParams, filters?: SedeFilters): Observable<Sede[]> {
    return this.apiService.getPaginated<Sede>(this.endpoint, pagination, filters);
  }

  
  getSedeById(id: string): Observable<Sede> {
    return this.apiService.get<Sede>(`${this.endpoint}/sede/${id}`);
  }

  
  createSede(sede: CreateSedeRequest): Observable<Sede> {
    return this.apiService.post<Sede>(this.endpoint, sede);
  }

  
  updateSede(id: string, sede: UpdateSedeRequest): Observable<Sede> {
    return this.apiService.put<Sede>(`${this.endpoint}/${id}`, sede);
  }

  
  deleteSede(id: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`);
  }

  
  getSedeByNombre(nombre: string): Observable<Sede> {
    return this.apiService.get<Sede>(`${this.endpoint}/nombre/${nombre}`);
  }
}

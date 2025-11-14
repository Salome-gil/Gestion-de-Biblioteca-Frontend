import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateMaterialRequest,
  Material,
  MaterialFilters,
  UpdateMaterialRequest
} from '../../shared/models/Material_Bibliografico.model';
import { PaginationParams } from '../models/api-response.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private readonly endpoint = 'materiales';

  constructor(private apiService: ApiService) {}

  
  getMateriales(idBiblioteca: string, pagination: PaginationParams, filters?: MaterialFilters): Observable<Material[]> {
    return this.apiService.getPaginated<Material>(`${this.endpoint}/${idBiblioteca}`,pagination,filters);
  }

  
  getMaterialById(idBiblioteca: string, idMaterial: string): Observable<Material> {
    return this.apiService.get<Material>(`${this.endpoint}/${idBiblioteca}/material/${idMaterial}`);
  }

 
  createMaterial(data: CreateMaterialRequest): Observable<Material> {
    return this.apiService.post<Material>(this.endpoint, data);
  }

 
updateMaterial(idBiblioteca: string, idMaterial: string, data: UpdateMaterialRequest): Observable<Material> {
  return this.apiService.put<Material>(`${this.endpoint}/${idBiblioteca}/${idMaterial}`, data);
  }

  deleteMaterial(idBiblioteca: string, idMaterial: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${idBiblioteca}/material/${idMaterial}`);
  }

  
  getMaterialesByNombre(idBiblioteca: string, nombre: string): Observable<Material[]> {
    return this.apiService.get<Material[]>(`${this.endpoint}/${idBiblioteca}/nombre/${nombre}`);
  }

  
  getMaterialesByTipo(idBiblioteca: string, tipo: string): Observable<Material[]> {
    return this.apiService.get<Material[]>(`${this.endpoint}/${idBiblioteca}/tipo/${tipo}`);
  }

  
  getMaterialesByAutor(idBiblioteca: string, autor: string): Observable<Material[]> {
    return this.apiService.get<Material[]>(`${this.endpoint}/${idBiblioteca}/autor/${autor}`);
  }

  
  getMaterialesByDisponibilidad(idBiblioteca: string, disponible: boolean): Observable<Material[]> {
    return this.apiService.get<Material[]>(`${this.endpoint}/${idBiblioteca}/disponible/${disponible}`);
  }


  getMaterialesByCategoria(idBiblioteca: string, idCategoria: string): Observable<Material[]> {
    return this.apiService.get<Material[]>(`${this.endpoint}/${idBiblioteca}/categoria/${idCategoria}`);
  }


}
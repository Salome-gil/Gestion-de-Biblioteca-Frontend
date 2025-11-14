import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categoria, CategoriaFilters, CreateCategoriaRequest, UpdateCategoriaRequest } from '../../shared/models/Categoria.model';
import { PaginationParams } from '../models/api-response.models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private readonly endpoint = 'categorias';

  constructor(private apiService: ApiService) {}

  
  getCategorias(idBiblioteca: string, pagination: PaginationParams, filters?: CategoriaFilters): Observable<Categoria[]> {
    return this.apiService.getPaginated<Categoria>(
      `${this.endpoint}/${idBiblioteca}`,
      pagination,
      filters
    );
  }

 
  getCategoriaById(idBiblioteca: string, idCategoria: string): Observable<Categoria> {
    return this.apiService.get<Categoria>(`${this.endpoint}/${idBiblioteca}/categoria/${idCategoria}`);
  }

  
  createCategoria(categoria: CreateCategoriaRequest): Observable<Categoria> {
    return this.apiService.post<Categoria>(this.endpoint, categoria);
  }

  
  updateCategoria(idBiblioteca: string, idCategoria: string, categoria: UpdateCategoriaRequest): Observable<Categoria> {
    return this.apiService.put<Categoria>(`${this.endpoint}/${idBiblioteca}/categoria/${idCategoria}`, categoria);
  }

  
  deleteCategoria(idBiblioteca: string, idCategoria: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${idBiblioteca}/categoria/${idCategoria}`);
  }

  
  getCategoriaByNombre(idBiblioteca: string, nombre: string): Observable<Categoria> {
    return this.apiService.get<Categoria>(`${this.endpoint}/${idBiblioteca}/nombre/${nombre}`);
  }
}

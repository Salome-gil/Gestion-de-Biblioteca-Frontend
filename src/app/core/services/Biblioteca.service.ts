import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Biblioteca, BibliotecaFilters, CreateBibliotecaRequest, UpdateBibliotecaRequest } from '../../shared/models/Biblioteca.model';
import { PaginationParams } from '../models/api-response.models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class BibliotecaService {
  private readonly endpoint = 'bibliotecas';

  constructor(private apiService: ApiService) { }

  getBibliotecas(pagination: PaginationParams, filters?: BibliotecaFilters): Observable<Biblioteca[]> {
    return this.apiService.getPaginated<Biblioteca>(this.endpoint, pagination, filters);
  }


  getBibliotecaById(id: string): Observable<Biblioteca> {
    return this.apiService.get<Biblioteca>(`${this.endpoint}/${id}`);
  }


  createBiblioteca(biblioteca: CreateBibliotecaRequest): Observable<Biblioteca> {
    return this.apiService.post<Biblioteca>(this.endpoint, biblioteca);
  }

 
  updateBiblioteca(id: string, biblioteca: UpdateBibliotecaRequest): Observable<Biblioteca> {
    return this.apiService.put<Biblioteca>(`${this.endpoint}/${id}`, biblioteca);
  }

  
  deleteBiblioteca(id: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`);
  }

  
  getBibliotecaByNombre(nombre: string): Observable<Biblioteca> {
    return this.apiService.get<Biblioteca>(`${this.endpoint}/nombre/${nombre}`);
  }

  
  getBibliotecaBySede(sede: string): Observable<Biblioteca[]> {
    return this.apiService.get<Biblioteca[]>(`${this.endpoint}/sede/${sede}`);
  }

}

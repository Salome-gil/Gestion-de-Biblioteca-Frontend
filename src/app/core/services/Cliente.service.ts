import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente, ClienteFilters, CreateClienteRequest, UpdateClienteRequest } from '../../shared/models/Cliente.model';
import { PaginationParams } from '../models/api-response.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private readonly endpoint = 'clientes';

  constructor(private apiService: ApiService) {}

  getClientes(idBiblioteca: string, pagination: PaginationParams, filters?: ClienteFilters): Observable<Cliente[]> {
    return this.apiService.getPaginated<Cliente>(`${this.endpoint}/${idBiblioteca}`,pagination,filters);
  }

 
  getClienteById(idBiblioteca: string, codigo: string): Observable<Cliente> {
    return this.apiService.get<Cliente>(`${this.endpoint}/${idBiblioteca}/cliente/${codigo}`);
  }

 
  createCliente(cliente: CreateClienteRequest): Observable<Cliente> {
    return this.apiService.post<Cliente>(this.endpoint, cliente);
  }

 
  updateCliente(idBiblioteca: string, codigo: string, cliente: UpdateClienteRequest): Observable<Cliente> {
    return this.apiService.put<Cliente>(`${this.endpoint}/${idBiblioteca}/cliente/${codigo}`, cliente);
  }

 
  deleteCliente(idBiblioteca: string, codigo: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${idBiblioteca}/cliente/${codigo}`);
  }

 
  getClientesByNombre(idBiblioteca: string, nombre: string): Observable<Cliente[]> {
    return this.apiService.get<Cliente[]>(`${this.endpoint}/${idBiblioteca}/nombre/${nombre}`);
  }

 
  getClientesByTipo(idBiblioteca: string, tipoCliente: string): Observable<Cliente[]> {
    return this.apiService.get<Cliente[]>(`${this.endpoint}/${idBiblioteca}/tipo/${tipoCliente}`);
  }

 
  getClientesByDetalle(idBiblioteca: string, detalleTipo: string): Observable<Cliente[]> {
    return this.apiService.get<Cliente[]>(`${this.endpoint}/${idBiblioteca}/detalle/${detalleTipo}`);
  }

 
  getClientesByVetado(idBiblioteca: string, vetado: boolean): Observable<Cliente[]> {
    return this.apiService.get<Cliente[]>(`${this.endpoint}/${idBiblioteca}/vetado/${vetado}`);
  }
}

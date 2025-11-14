import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateReservaRequest, Reserva, ReservaFilters, UpdateReservaRequest } from '../../shared/models/Reserva.model';
import { PaginationParams } from '../models/api-response.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private readonly endpoint = 'reservas';

  constructor(private apiService: ApiService) {}

  
  getReservas(idBiblioteca: string, pagination: PaginationParams, filters?: ReservaFilters): Observable<Reserva[]> {
    return this.apiService.getPaginated<Reserva>(`${this.endpoint}/${idBiblioteca}`,pagination,filters);
  }

  
  getReservaById(idBiblioteca: string, idReserva: string): Observable<Reserva> {
    return this.apiService.get<Reserva>(`${this.endpoint}/${idBiblioteca}/reserva/${idReserva}`);
  }

  
  createReserva(reserva: CreateReservaRequest): Observable<Reserva> {
    return this.apiService.post<Reserva>(this.endpoint, reserva);
  }

  
  updateReserva(idBiblioteca: string, idReserva: string, reserva: UpdateReservaRequest): Observable<Reserva> {
    return this.apiService.put<Reserva>(`${this.endpoint}/${idBiblioteca}/${idReserva}`, reserva);
  }

  
  deleteReserva(idBiblioteca: string, idReserva: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${idBiblioteca}/${idReserva}`);
  }

  
  getReservasByCliente(idBiblioteca: string, codCliente: string): Observable<Reserva[]> {
    return this.apiService.get<Reserva[]>(`${this.endpoint}/${idBiblioteca}/cliente/${codCliente}`);
  }

  
  getReservasByMaterial(idBiblioteca: string, idMaterial: string): Observable<Reserva[]> {
    return this.apiService.get<Reserva[]>(`${this.endpoint}/${idBiblioteca}/material/${idMaterial}`);
  }

  
  getReservasByEstado(idBiblioteca: string, estado: string): Observable<Reserva[]> {
    return this.apiService.get<Reserva[]>(`${this.endpoint}/${idBiblioteca}/estado/${estado}`);
  }
}

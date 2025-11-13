import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

import { SedeService } from '../../../core/services/Sede.service';
import {
  CreateSedeRequest,
  Sede,
  UpdateSedeRequest
} from '../../../shared/models/Sede.model';

@Component({
  selector: 'app-sede-crud',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ToolbarModule,
    ButtonModule,
    RippleModule,
    DialogModule,
    InputTextModule,
    ConfirmDialogModule,
    ToastModule,
    IconFieldModule,
    InputIconModule
  ],
  templateUrl: './sede-list.component.html',
  providers: [MessageService, ConfirmationService]
})
export class SedeListComponent implements OnInit {
  @ViewChild('dt') dt!: Table;

  sedes = signal<Sede[]>([]);
  selectedSedes: Sede[] = [];
  sede!: Sede;
  sedeDialog = false;
  submitted = false;
  loading = false;

  constructor(
    private sedeService: SedeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadSedes();
  }

  loadSedes() {
    this.loading = true;
    this.sedeService.getSedes({ page: 1, limit: 100 }).subscribe({
      next: (data) => {
        console.log('Datos recibidos de la API:', data);
        this.sedes.set(data);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar sedes:', err);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las sedes'
        });
      }
    });
  }

  onGlobalFilter(event: Event) {
    this.dt.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.sede = {
      id_sede: '',
      id: '',
      nombre: '',
      direccion: '',
      fecha_creacion: new Date().toISOString()
    };
    this.submitted = false;
    this.sedeDialog = true;
  }

  editSede(sede: Sede) {
    this.sede = { ...sede };
    this.sedeDialog = true;
  }

  deleteSede(sede: Sede) {
    this.confirmationService.confirm({
      message: `¿Seguro que deseas eliminar la sede "${sede.nombre}"?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.sedeService.deleteSede(sede.id_sede).subscribe({
          next: () => {
            this.sedes.set(this.sedes().filter(s => s.id_sede !== sede.id_sede));
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminada',
              detail: 'Sede eliminada correctamente'
            });
          }
        });
      }
    });
  }

  deleteSelectedSedes() {
    this.confirmationService.confirm({
      message: '¿Eliminar las sedes seleccionadas?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const ids = this.selectedSedes.map(s => s.id_sede);
        this.sedes.set(this.sedes().filter(s => !ids.includes(s.id_sede)));
        this.selectedSedes = [];
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Sedes eliminadas'
        });
      }
    });
  }

  hideDialog() {
    this.sedeDialog = false;
    this.submitted = false;
  }

  saveSede() {
    this.submitted = true;
    if (!this.sede.nombre?.trim()) return;

    if (this.sede.id_sede) {
      const updateReq: UpdateSedeRequest = {
        nombre: this.sede.nombre,
        direccion: this.sede.direccion
      };
      this.sedeService.updateSede(this.sede.id_sede, updateReq).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Actualizada',
            detail: 'Sede actualizada correctamente'
          });
          this.loadSedes();
          this.sedeDialog = false;
        }
      });
    } else {
      const createReq: CreateSedeRequest = {
        nombre: this.sede.nombre,
        direccion: this.sede.direccion
      };
      this.sedeService.createSede(createReq).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Creada',
            detail: 'Sede creada exitosamente'
          });
          this.loadSedes();
          this.sedeDialog = false;
        }
      });
    }
  }

  exportCSV() {
    this.dt.exportCSV();
  }
}

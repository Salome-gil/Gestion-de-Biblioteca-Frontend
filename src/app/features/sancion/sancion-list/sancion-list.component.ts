import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

import { SancionService } from '../../../core/services/Sancion.service';
import {
  CreateSancionRequest,
  Sancion,
  UpdateSancionRequest
} from '../../../shared/models/Sancion.model';

@Component({
  selector: 'app-sancion-crud',
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
    InputIconModule,
    DatePickerModule
  ],
  templateUrl: './sancion-list.component.html',
  providers: [MessageService, ConfirmationService]
})
export class SancionListComponent implements OnInit {
  @ViewChild('dt') dt!: Table;

  sanciones = signal<Sancion[]>([]);
  selectedSanciones: Sancion[] = [];
  sancion!: Sancion;
  sancionDialog = false;
  submitted = false;
  loading = false;

  idBiblioteca = '6d4262ea-ec2f-4814-9e1b-dc2b63c5bfe6'; 

  constructor(
    private sancionService: SancionService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadSanciones();
  }

  loadSanciones() {
    this.loading = true;
    this.sancionService.getSanciones(this.idBiblioteca, { page: 1, limit: 100 }).subscribe({
      next: (data) => {
        console.log('Datos recibidos de la API:', data);
        this.sanciones.set(data);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar sanciones:', err);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las sanciones'
        });
      }
    });
  }

  onGlobalFilter(event: Event) {
    this.dt.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.sancion = {
      id_sancion: '',
      id: '',
      id_biblioteca: this.idBiblioteca,
      motivo: '',
      fecha_sancion: '',
      monto: 0,
      cod_cliente: '',
      fecha_creacion: new Date().toISOString()
    };
    this.submitted = false;
    this.sancionDialog = true;
  }

  editSancion(sancion: Sancion) {
    this.sancion = { ...sancion };
    this.sancionDialog = true;
  }

  deleteSancion(sancion: Sancion) {
    this.confirmationService.confirm({
      message: `¿Seguro que deseas eliminar la sanción del cliente "${sancion.cod_cliente}"?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.sancionService.deleteSancion(this.idBiblioteca, sancion.id_sancion).subscribe({
          next: () => {
            this.sanciones.set(this.sanciones().filter(s => s.id_sancion !== sancion.id_sancion));
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminada',
              detail: 'Sanción eliminada correctamente'
            });
          }
        });
      }
    });
  }

  deleteSelectedSanciones() {
    this.confirmationService.confirm({
      message: '¿Eliminar las sanciones seleccionadas?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const ids = this.selectedSanciones.map(s => s.id_sancion);
        this.sanciones.set(this.sanciones().filter(s => !ids.includes(s.id_sancion)));
        this.selectedSanciones = [];
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Sanciones eliminadas'
        });
      }
    });
  }

  hideDialog() {
    this.sancionDialog = false;
    this.submitted = false;
  }

  saveSancion() {
    this.submitted = true;
    if (!this.sancion.cod_cliente?.trim() || !this.sancion.motivo?.trim()) return;

    const formatFecha = (fecha: any): string => {
      if (!fecha) return new Date().toISOString().split('T')[0];
      return fecha instanceof Date
        ? fecha.toISOString().split('T')[0]
        : fecha; 
    };

    if (this.sancion.id_sancion) {
      const updateReq: UpdateSancionRequest = {
        motivo: this.sancion.motivo,
        fecha_sancion: this.sancion.fecha_sancion 
          ? new Date(this.sancion.fecha_sancion).toISOString().split('T')[0]
          : undefined,
        monto: Number(this.sancion.monto),
        cod_cliente: this.sancion.cod_cliente
      };
      console.log('Datos que se envían al backend:', updateReq);


      this.sancionService.updateSancion(this.idBiblioteca, this.sancion.id_sancion, updateReq).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Actualizada',
            detail: 'Sanción actualizada correctamente'
          });
          this.loadSanciones();
          this.sancionDialog = false;
        },
        error: (err) => {
          console.error(' Error en actualización:', err);
        }
      });
    } else {
      const createReq: CreateSancionRequest = {
        id_biblioteca: this.idBiblioteca,
        motivo: this.sancion.motivo.trim(),
        fecha_sancion: formatFecha(this.sancion.fecha_sancion),
        monto: Number(this.sancion.monto),
        cod_cliente: this.sancion.cod_cliente.trim()
      };

      console.log(' Enviando creación:', createReq);

      this.sancionService.createSancion(createReq).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Creada',
            detail: 'Sanción creada exitosamente'
          });
          this.loadSanciones();
          this.sancionDialog = false;
        },
        error: (err) => {
          console.error(' Error en creación:', err);
        }
      });
    }
  }


  exportCSV() {
    this.dt.exportCSV();
  }
}

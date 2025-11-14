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

import { ReservaService } from '../../../core/services/Reserva.service';
import { Reserva } from '../../../shared/models/Reserva.model';

@Component({
  selector: 'app-reserva-crud',
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
  templateUrl: './reserva-list.component.html',
  providers: [MessageService, ConfirmationService]
})
export class ReservaListComponent implements OnInit {
  @ViewChild('dt') dt!: Table;

  reservas = signal<Reserva[]>([]);
  selectedReservas: Reserva[] = [];
  reserva!: Reserva;
  reservaDialog = false;
  submitted = false;
  loading = false;

  idBiblioteca = '6d4262ea-ec2f-4814-9e1b-dc2b63c5bfe6'; 

  constructor(
    private reservaService: ReservaService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadReservas();
  }

  loadReservas() {
    this.loading = true;
    this.reservaService.getReservas(this.idBiblioteca, { page: 1, limit: 100 }).subscribe({
      next: (data) => {
        this.reservas.set(data);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar reservas:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las reservas'
        });
        this.loading = false;
      }
    });
  }

  onGlobalFilter(event: Event) {
    this.dt.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
  this.reserva = {
    id_reserva: '',
    id: '',
    id_biblioteca: this.idBiblioteca,
    fecha_reserva: '',   
    estado: 'pendiente',
    cod_cliente: '',
    id_material: '',
    fecha_creacion: new Date().toISOString()
  };
  this.submitted = false;
  this.reservaDialog = true;
}
  editReserva(reserva: Reserva) {
    this.reserva = { ...reserva };
    this.reservaDialog = true;
  }

  deleteReserva(reserva: Reserva) {
    this.confirmationService.confirm({
      message: `¿Seguro que deseas eliminar la reserva del cliente "${reserva.cod_cliente}"?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.reservaService.deleteReserva(this.idBiblioteca, reserva.id_reserva).subscribe({
          next: () => {
            this.reservas.set(this.reservas().filter(r => r.id_reserva !== reserva.id_reserva));
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminada',
              detail: 'Reserva eliminada correctamente'
            });
          }
        });
      }
    });
  }

  deleteSelectedReservas() {
    this.confirmationService.confirm({
      message: '¿Eliminar las reservas seleccionadas?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const ids = this.selectedReservas.map(r => r.id_reserva);
        this.reservas.set(this.reservas().filter(r => !ids.includes(r.id_reserva)));
        this.selectedReservas = [];
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Reservas eliminadas correctamente'
        });
      }
    });
  }

  hideDialog() {
    this.reservaDialog = false;
    this.submitted = false;
  }
saveReserva() {
  this.submitted = true;

  if (!this.reserva.cod_cliente?.trim() || !this.reserva.id_material?.trim()) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Campos obligatorios',
      detail: 'Debe ingresar el cliente y el material'
    });
    return;
  }

  const formatDateForApi = (value: any): string | null => {
    if (!value) return null;
    if (value instanceof Date) return value.toISOString().split('T')[0]; // 'YYYY-MM-DD'
    if (typeof value === 'string' && value.trim()) return value;
    try {
      const d = new Date(value);
      if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
    } catch (e) {}
    return null;
  };

  const fechaReservaFormatted = formatDateForApi(this.reserva.fecha_reserva);

  if (!fechaReservaFormatted) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Debe seleccionar una fecha de reserva válida'
    });
    return;
  }

  const isValidUUID = (v: string): boolean =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

  if (!isValidUUID(this.reserva.cod_cliente)) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'El código del cliente no tiene formato UUID válido'
    });
    return;
  }

  if (!isValidUUID(this.reserva.id_material)) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'El ID del material no tiene formato UUID válido'
    });
    return;
  }

  const createReq = {
    id_biblioteca: this.idBiblioteca,
    fecha_reserva: fechaReservaFormatted,
    estado: this.reserva.estado?.trim() || 'pendiente',
    cod_cliente: this.reserva.cod_cliente,
    id_material: this.reserva.id_material
  };

  this.reservaService.createReserva(createReq).subscribe({
    next: () => {
      this.messageService.add({
        severity: 'success',
        summary: 'Creado',
        detail: 'Reserva creada exitosamente'
      });
      this.loadReservas();  // recarga lista
      this.reservaDialog = false;
    },
    error: (err) => {
      console.error('Error creando reserva:', err);
      const detail =
        err?.error?.detail ||
        err?.error?.message ||
        'No se pudo crear la reserva';
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail
      });
    }
  });
}

  exportCSV() {
    this.dt.exportCSV();
  }
}

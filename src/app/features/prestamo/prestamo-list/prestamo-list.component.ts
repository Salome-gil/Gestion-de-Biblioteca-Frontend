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
import { PrestamoService } from '../../../core/services/Prestamo.service';
import { CreatePrestamoRequest,Prestamo,UpdatePrestamoRequest } from '../../../shared/models/Prestamo.model';

@Component({
  selector: 'app-prestamo-crud',
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
  templateUrl: './prestamo-list.component.html',
  providers: [MessageService, ConfirmationService]
})
export class PrestamoListComponent implements OnInit {
  @ViewChild('dt') dt!: Table;

  prestamos = signal<Prestamo[]>([]);
  selectedPrestamos: Prestamo[] = [];
  prestamo!: Prestamo;
  prestamoDialog = false;
  submitted = false;
  loading = false;

  idBiblioteca = '6d4262ea-ec2f-4814-9e1b-dc2b63c5bfe6'; 

  constructor(
    private prestamoService: PrestamoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadPrestamos();
  }

  loadPrestamos() {
    this.loading = true;
    this.prestamoService.getPrestamos(this.idBiblioteca, { page: 1, limit: 100 }).subscribe({
      next: (data) => {
        console.log('Datos recibidos de la API:', data);
        this.prestamos.set(data);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar préstamos:', err);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los préstamos'
        });
      }
    });
  }

  onGlobalFilter(event: Event) {
    this.dt.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.prestamo = {
      id: '',
      id_biblioteca: this.idBiblioteca,
      fecha_prestamo: '',
      fecha_entrega: '',
      id_material: '',
      cod_cliente: '',
      fecha_creacion: new Date().toISOString()
    };
    this.submitted = false;
    this.prestamoDialog = true;
  }

  editPrestamo(prestamo: Prestamo) {
    this.prestamo = { ...prestamo };
    this.prestamoDialog = true;
  }

  deletePrestamo(prestamo: Prestamo) {
    this.confirmationService.confirm({
      message: `¿Seguro que deseas eliminar el préstamo del cliente "${prestamo.cod_cliente}"?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.prestamoService.deletePrestamo(this.idBiblioteca, prestamo.id).subscribe({
          next: () => {
            this.prestamos.set(this.prestamos().filter(p => p.id !== prestamo.id));
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: 'Préstamo eliminado correctamente'
            });
          }
        });
      }
    });
  }

  deleteSelectedPrestamos() {
    this.confirmationService.confirm({
      message: '¿Eliminar los préstamos seleccionados?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const ids = this.selectedPrestamos.map(p => p.id);
        this.prestamos.set(this.prestamos().filter(p => !ids.includes(p.id)));
        this.selectedPrestamos = [];
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Préstamos eliminados'
        });
      }
    });
  }

  hideDialog() {
    this.prestamoDialog = false;
    this.submitted = false;
  }

  savePrestamo() {
    this.submitted = true;
    if (!this.prestamo.cod_cliente?.trim() || !this.prestamo.id_material?.trim()) return;

    const formatDate = (date: any): string => {
      if (!date) return '';
      if (typeof date === 'string') {
        return date.split('T')[0];
      }
      if (date instanceof Date) {
        return date.toISOString().split('T')[0];
      }
      return '';
    };
    
    if (this.prestamo.id) {
      const updateReq: UpdatePrestamoRequest = {
        fecha_prestamo: formatDate(this.prestamo.fecha_prestamo),
        fecha_entrega: formatDate(this.prestamo.fecha_entrega),
        id_material: this.prestamo.id_material,
        cod_cliente: this.prestamo.cod_cliente
      };
      this.prestamoService.updatePrestamo(this.idBiblioteca, this.prestamo.id, updateReq).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Actualizado',
            detail: 'Préstamo actualizado correctamente'
          });
          this.loadPrestamos();
          this.prestamoDialog = false;
        }
      });
    } else {
      const createReq: CreatePrestamoRequest = {
        id_biblioteca: this.idBiblioteca,
        fecha_prestamo: formatDate(this.prestamo.fecha_prestamo),
        fecha_entrega: formatDate(this.prestamo.fecha_entrega),
        id_material: this.prestamo.id_material,
        cod_cliente: this.prestamo.cod_cliente
      };

      this.prestamoService.createPrestamo(createReq).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Creado',
            detail: 'Préstamo registrado correctamente'
          });
          this.loadPrestamos();
          this.prestamoDialog = false;
        },
        error: (err) => {
          console.error('Error al crear préstamo:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear el préstamo'
          });
        }
      });
    }
  }

  exportCSV() {
    this.dt.exportCSV();
  }
}

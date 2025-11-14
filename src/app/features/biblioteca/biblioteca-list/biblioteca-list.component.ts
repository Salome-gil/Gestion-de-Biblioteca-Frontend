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
import { BibliotecaService } from '../../../core/services/Biblioteca.service';
import { Biblioteca, CreateBibliotecaRequest, UpdateBibliotecaRequest } from '../../../shared/models/Biblioteca.model';

@Component({
  selector: 'app-biblioteca-crud',
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
  templateUrl: './biblioteca-list.component.html',
  providers: [MessageService, ConfirmationService]
})
export class BibliotecaListComponent implements OnInit {
  @ViewChild('dt') dt!: Table;

  bibliotecas = signal<Biblioteca[]>([]);
  selectedBibliotecas: Biblioteca[] = [];
  biblioteca!: Biblioteca;
  bibliotecaDialog: boolean = false;
  submitted: boolean = false;
  loading: boolean = false;

  constructor(
    private bibliotecaService: BibliotecaService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadBibliotecas();
  }

  loadBibliotecas() {
    this.loading = true;
    this.bibliotecaService.getBibliotecas({ page: 1, limit: 100 }).subscribe({
      next: (data) => {
        console.log('Bibliotecas recibidas:', data);
        this.bibliotecas.set(data);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar bibliotecas:', err);
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las bibliotecas' });
      }
    });
  }

  onGlobalFilter(event: Event) {
    this.dt.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.biblioteca = {
      id_biblioteca: '',
      id: '',
      nombre: '',
      id_sede: '',
      fecha_creacion: new Date().toISOString(),
      sede: { id_sede: '' }
    };
    this.submitted = false;
    this.bibliotecaDialog = true;
  }

  editBiblioteca(biblioteca: Biblioteca) {
    this.biblioteca = { ...biblioteca };
    this.bibliotecaDialog = true;
  }

  deleteBiblioteca(biblioteca: Biblioteca) {
    this.confirmationService.confirm({
      message: `¿Seguro que deseas eliminar la biblioteca "${biblioteca.nombre}"?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.bibliotecaService.deleteBiblioteca(biblioteca.id_biblioteca).subscribe({
          next: () => {
            this.bibliotecas.set(this.bibliotecas().filter(b => b.id_biblioteca !== biblioteca.id_biblioteca));
            this.messageService.add({ severity: 'success', summary: 'Eliminada', detail: 'Biblioteca eliminada correctamente' });
          }
        });
      }
    });
  }

  deleteSelectedBibliotecas() {
    this.confirmationService.confirm({
      message: '¿Eliminar las bibliotecas seleccionadas?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const ids = this.selectedBibliotecas.map(b => b.id_biblioteca);
        this.bibliotecas.set(this.bibliotecas().filter(b => !ids.includes(b.id_biblioteca)));
        this.selectedBibliotecas = [];
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Bibliotecas eliminadas' });
      }
    });
  }

  hideDialog() {
    this.bibliotecaDialog = false;
    this.submitted = false;
  }

  saveBiblioteca() {
    this.submitted = true;
    if (!this.biblioteca.nombre?.trim()) return;

    if (this.biblioteca.id_biblioteca) {
      const updateReq: UpdateBibliotecaRequest = {
        nombre: this.biblioteca.nombre,
        id_sede: this.biblioteca.id_sede
      };
      this.bibliotecaService.updateBiblioteca(this.biblioteca.id_biblioteca, updateReq).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Actualizada', detail: 'Biblioteca actualizada correctamente' });
          this.loadBibliotecas();
          this.bibliotecaDialog = false;
        }
      });
    } else {
      const createReq: CreateBibliotecaRequest = {
        nombre: this.biblioteca.nombre,
        id_sede: this.biblioteca.id_sede
      };
      this.bibliotecaService.createBiblioteca(createReq).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Creada', detail: 'Biblioteca creada exitosamente' });
          this.loadBibliotecas();
          this.bibliotecaDialog = false;
        }
      });
    }
  }

  exportCSV() {
    this.dt.exportCSV();
  }
}

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
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { CategoriaService } from '../../../core/services/Categoria.service';
import { Categoria, CreateCategoriaRequest, UpdateCategoriaRequest } from '../../../shared/models/Categoria.model';

@Component({
  selector: 'app-categoria-crud',
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
    TextareaModule,
    ConfirmDialogModule,
    ToastModule,
    IconFieldModule,
    InputIconModule
  ],
  templateUrl: './categoria-list.component.html',
  providers: [MessageService, ConfirmationService]
})
export class CategoriaListComponent implements OnInit {
  @ViewChild('dt') dt!: Table;

  categorias = signal<Categoria[]>([]);
  selectedCategorias: Categoria[] = [];
  categoria!: Categoria;
  categoriaDialog: boolean = false;
  submitted: boolean = false;
  loading: boolean = false;

  idBiblioteca = '6d4262ea-ec2f-4814-9e1b-dc2b63c5bfe6'; 

  constructor(
    private categoriaService: CategoriaService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadCategorias();
  }

  loadCategorias() {
    this.loading = true;
    this.categoriaService.getCategorias(this.idBiblioteca, { page: 1, limit: 100 }).subscribe({
      next: (data) => {
        console.log('Datos recibidos de la API:', data);
        this.categorias.set(data);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las categorías' });
      }
    });
  }


  onGlobalFilter(event: Event) {
    this.dt.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.categoria = {
      id: '',
      id_categoria: '',
      id_biblioteca: this.idBiblioteca,
      nombre: '',
      descripcion: '',
      fecha_creacion: new Date().toISOString()
    };
    this.submitted = false;
    this.categoriaDialog = true;
  }

  editCategoria(categoria: Categoria) {
    this.categoria = { ...categoria };
    this.categoriaDialog = true;
  }

  deleteCategoria(categoria: Categoria) {
    this.confirmationService.confirm({
      message: `¿Seguro que deseas eliminar "${categoria.nombre}"?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.categoriaService.deleteCategoria(this.idBiblioteca, categoria.id_categoria).subscribe({
          next: () => {
            this.categorias.set(this.categorias().filter(c => c.id_categoria !== categoria.id_categoria));
            this.messageService.add({ severity: 'success', summary: 'Eliminada', detail: 'Categoría eliminada correctamente' });
          }
        });
      }
    });
  }

  deleteSelectedCategorias() {
    this.confirmationService.confirm({
      message: '¿Eliminar las categorías seleccionadas?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const ids = this.selectedCategorias.map(c => c.id_categoria);
        this.categorias.set(this.categorias().filter(c => !ids.includes(c.id_categoria)));
        this.selectedCategorias = [];
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Categorías eliminadas' });
      }
    });
  }

  hideDialog() {
    this.categoriaDialog = false;
    this.submitted = false;
  }

  saveCategoria() {
    this.submitted = true;
    if (!this.categoria.nombre?.trim()) return;

    if (this.categoria.id_categoria) {
      const updateReq: UpdateCategoriaRequest = {
        nombre: this.categoria.nombre,
        descripcion: this.categoria.descripcion
      };
      this.categoriaService.updateCategoria(this.idBiblioteca, this.categoria.id_categoria, updateReq).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Actualizada', detail: 'Categoría actualizada correctamente' });
          this.loadCategorias();
          this.categoriaDialog = false;
        }
      });
    } else {
      const createReq: CreateCategoriaRequest = {
        id_biblioteca: this.idBiblioteca,
        nombre: this.categoria.nombre,
        descripcion: this.categoria.descripcion
      };
      this.categoriaService.createCategoria(createReq).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Creada', detail: 'Categoría creada exitosamente' });
          this.loadCategorias();
          this.categoriaDialog = false;
        }
      });
    }
  }

  exportCSV() {
    this.dt.exportCSV();
  }
}

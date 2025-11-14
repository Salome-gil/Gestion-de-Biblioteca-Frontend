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
import { PaginationParams } from 'src/app/core/models/api-response.model';
import { CategoriaService } from '../../../core/services/Categoria.service';
import { MaterialService } from '../../../core/services/Material_Bibliografico.service';
import { Categoria } from '../../../shared/models/Categoria.model';
import {
  CreateMaterialRequest,
  Material,
  UpdateMaterialRequest
} from '../../../shared/models/Material_Bibliografico.model';

@Component({
  selector: 'app-material-crud',
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
  ],
  templateUrl: './material-bibliografico-list.component.html',
  providers: [MessageService, ConfirmationService]
})
export class MaterialBibliograficoListComponent implements OnInit {
  @ViewChild('dt') dt!: Table;

  materiales = signal<Material[]>([]);
  categorias = signal<Categoria[]>([]);
  selectedMateriales: Material[] = [];
  material!: Material;
  materialDialog = false;
  submitted = false;
  loading = false;

  idBiblioteca = '6d4262ea-ec2f-4814-9e1b-dc2b63c5bfe6'; 
  pagination: PaginationParams = { page: 1, limit: 10 };

  constructor(
    private materialService: MaterialService,
    private categoriaService: CategoriaService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadMateriales();
    this.loadCategorias();
  }

  loadMateriales() {
    this.loading = true;
    this.materialService.getMateriales(this.idBiblioteca, this.pagination).subscribe({
      next: (data) => {
        console.log('Materiales:', data);
        this.materiales.set(data);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar materiales:', err);
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los materiales' });
      }
    });
  }

  loadCategorias() {
    this.categoriaService.getCategorias(this.idBiblioteca, { page: 1, limit: 100 }).subscribe({
      next: (data) => this.categorias.set(data),
      error: () => this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'No se pudieron cargar las categorías' })
    });
  }

  onGlobalFilter(event: Event) {
    this.dt.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.material = {
      id: '',
      id_material: '',
      id_biblioteca: this.idBiblioteca,
      titulo: '',
      autor: '',
      estado: 'disponible',
      id_categoria: '',
      id_sede: '',
      fecha_creacion: new Date().toISOString()
    };
    this.submitted = false;
    this.materialDialog = true;
  }

  editMaterial(material: Material) {
    this.material = { ...material };
    this.materialDialog = true;
  }

  deleteMaterial(material: Material) {
    this.confirmationService.confirm({
      message: `¿Seguro que deseas eliminar "${material.titulo}"?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.materialService.deleteMaterial(this.idBiblioteca, material.id_material).subscribe({
          next: () => {
            this.materiales.set(this.materiales().filter(m => m.id_material !== material.id_material));
            this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Material eliminado correctamente' });
          }
        });
      }
    });
  }

  deleteSelectedMateriales() {
    this.confirmationService.confirm({
      message: '¿Eliminar los materiales seleccionados?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const ids = this.selectedMateriales.map(m => m.id_material);
        this.materiales.set(this.materiales().filter(m => !ids.includes(m.id_material)));
        this.selectedMateriales = [];
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Materiales eliminados' });
      }
    });
  }

  hideDialog() {
    this.materialDialog = false;
    this.submitted = false;
  }

  saveMaterial() {
    this.submitted = true;
    if (!this.material.titulo?.trim() || !this.material.autor?.trim()) return;

    if (this.material.id_material) {
      const updateReq: UpdateMaterialRequest = {
        titulo: this.material.titulo,
        autor: this.material.autor,
        estado: this.material.estado,
        id_categoria: this.material.id_categoria
      };
      this.materialService.updateMaterial(this.idBiblioteca, this.material.id_material, updateReq).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Material actualizado correctamente' });
          this.loadMateriales();
          this.materialDialog = false;
        }
      });
    } else {
      const createReq: CreateMaterialRequest = {
        id_biblioteca: this.idBiblioteca,
        titulo: this.material.titulo,
        autor: this.material.autor,
        estado: this.material.estado,
        id_categoria: this.material.id_categoria,
        id_sede:this.material.id_sede
      };
      this.materialService.createMaterial(createReq).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Creado', detail: 'Material creado exitosamente' });
          this.loadMateriales();
          this.materialDialog = false;
        }
      });
    }
  }

  exportCSV() {
    this.dt.exportCSV();
  }

}

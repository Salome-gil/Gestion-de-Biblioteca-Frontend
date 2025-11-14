import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ClienteService } from '../../../core/services/Cliente.service';
import { Cliente, CreateClienteRequest, UpdateClienteRequest } from '../../../shared/models/Cliente.model';

@Component({
  selector: 'app-cliente-crud',
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
    CheckboxModule
  ],
  templateUrl: './cliente-list.component.html',
  providers: [MessageService, ConfirmationService]
})
export class ClienteListComponent implements OnInit {
  @ViewChild('dt') dt!: Table;

  clientes = signal<Cliente[]>([]);
  selectedClientes: Cliente[] = [];
  cliente!: Cliente;
  clienteDialog: boolean = false;
  submitted: boolean = false;
  loading: boolean = false;

  idBiblioteca = '6d4262ea-ec2f-4814-9e1b-dc2b63c5bfe6'; 

  constructor(
    private clienteService: ClienteService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadClientes();
  }

  loadClientes() {
    this.loading = true;
    this.clienteService.getClientes(this.idBiblioteca, { page: 1, limit: 100 }).subscribe({
      next: (data) => {
        console.log('Clientes cargados:', data);
        this.clientes.set(data);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los clientes' });
      }
    });
  }

  onGlobalFilter(event: Event) {
    this.dt.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.cliente = {
      codigo: '',
      id: '',
      nombre: '',
      tipo_cliente: '',
      detalle_tipo: '',
      vetado: false,
      id_biblioteca: this.idBiblioteca,
      fecha_creacion: new Date().toISOString()
    };
    this.submitted = false;
    this.clienteDialog = true;
  }

  editCliente(cliente: Cliente) {
    this.cliente = { ...cliente };
    this.clienteDialog = true;
  }

  deleteCliente(cliente: Cliente) {
    this.confirmationService.confirm({
      message: `¿Seguro que deseas eliminar al cliente "${cliente.nombre}"?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.clienteService.deleteCliente(this.idBiblioteca, cliente.codigo).subscribe({
          next: () => {
            this.clientes.set(this.clientes().filter(c => c.codigo !== cliente.codigo));
            this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Cliente eliminado correctamente' });
          }
        });
      }
    });
  }

  deleteSelectedClientes() {
    this.confirmationService.confirm({
      message: '¿Eliminar los clientes seleccionados?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const ids = this.selectedClientes.map(c => c.codigo);
        this.clientes.set(this.clientes().filter(c => !ids.includes(c.codigo)));
        this.selectedClientes = [];
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Clientes eliminados' });
      }
    });
  }

  hideDialog() {
    this.clienteDialog = false;
    this.submitted = false;
  }

  saveCliente() {
    this.submitted = true;
    if (!this.cliente.nombre?.trim()) return;

    if (this.cliente.codigo) {
      const updateReq: UpdateClienteRequest = {
        nombre: this.cliente.nombre,
        tipo_cliente: this.cliente.tipo_cliente,
        detalle_tipo: this.cliente.detalle_tipo,
        vetado: this.cliente.vetado
      };
      this.clienteService.updateCliente(this.idBiblioteca, this.cliente.codigo, updateReq).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Cliente actualizado correctamente' });
          this.loadClientes();
          this.clienteDialog = false;
        }
      });
    } else {
      const createReq: CreateClienteRequest = {
        id_biblioteca: this.idBiblioteca,
        nombre: this.cliente.nombre,
        tipo_cliente: this.cliente.tipo_cliente,
        detalle_tipo: this.cliente.detalle_tipo,
        vetado: this.cliente.vetado
      };
      this.clienteService.createCliente(createReq).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Creado', detail: 'Cliente creado exitosamente' });
          this.loadClientes();
          this.clienteDialog = false;
        }
      });
    }
  }

  exportCSV() {
    this.dt.exportCSV();
  }
}

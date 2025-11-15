import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BibliotecaService } from 'src/app/core/services/Biblioteca.service';
import { ClienteService } from 'src/app/core/services/Cliente.service';
import { PrestamoService } from 'src/app/core/services/Prestamo.service';
import { SedeService } from 'src/app/core/services/Sede.service';
import { PaginationParams } from 'src/app/core/models/api-response.models';

@Component({
  standalone: true,
  selector: 'app-stats-widget',
  imports: [CommonModule],
  templateUrl: './statswidget.html',
})

export class StatsWidget implements OnInit {
  bibliotecasActivas = 0;
  clientesActivos = 0;
  sedesActivas = 0;
  totalPrestamos = 0;

  pagination: PaginationParams = {
    page: 1,
    limit: 9999
  };

  idBiblioteca = '6d4262ea-ec2f-4814-9e1b-dc2b63c5bfe6';

  constructor(
    private bibliotecaService: BibliotecaService,
    private clienteService: ClienteService,
    private sedeService: SedeService,
    private prestamoService: PrestamoService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {

    this.bibliotecaService.getBibliotecas(this.pagination).subscribe((res: any[]) => {
      this.bibliotecasActivas = res.length;
    });

    this.clienteService.getClientes(this.idBiblioteca, this.pagination).subscribe((res: any[]) => {
      this.clientesActivos = res.length;
    });

    this.sedeService.getSedes(this.pagination).subscribe((res: any[]) => {
      this.sedesActivas = res.length;
    });

    this.prestamoService.getPrestamos(this.idBiblioteca, this.pagination).subscribe((res: any[]) => {
      this.totalPrestamos = res.length;
    });
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { PrestamoService } from 'src/app/core/services/Prestamo.service';
import { Prestamo } from 'src/app/shared/models/Prestamo.model';

@Component({
  standalone: true,
  selector: 'app-notifications-widget',
  imports: [ButtonModule, MenuModule, CommonModule],
  templateUrl: './notificationswidget.html',
})
export class NotificationsWidget implements OnInit {
  prestamos: Prestamo[] = [];
  notificaciones: { mensaje: string; tipo: string }[] = [];
  items = [
    { label: 'Actualizar', icon: 'pi pi-refresh', command: () => this.cargarPrestamos() },
  ];

  constructor(private prestamoService: PrestamoService) {}

  ngOnInit(): void {
    this.cargarPrestamos();
  }

  cargarPrestamos(): void {
    const idBiblioteca = '6d4262ea-ec2f-4814-9e1b-dc2b63c5bfe6';

    this.prestamoService.getPrestamos(idBiblioteca, { page: 1, limit: 100 }).subscribe({
      next: (data: Prestamo[]) => {
        this.prestamos = data;
        this.verificarFechasEntrega();
      },
      error: (err) => console.error('Error al obtener préstamos:', err)
    });
  }

  verificarFechasEntrega(): void {
    this.notificaciones = [];
    const hoy = new Date();

    this.prestamos.forEach(prestamo => {
      const fechaEntrega = new Date(prestamo.fecha_entrega);
      const diferencia = (fechaEntrega.getTime() - hoy.getTime()) / (1000 * 3600 * 24);

      if (diferencia <= 3 && diferencia > 0) {
        this.notificaciones.push({
          mensaje: `El préstamo de "${prestamo.material?.titulo || 'Material sin título'}" vence en ${Math.ceil(diferencia)} días.`,
          tipo: 'alerta'
        });
      } else if (diferencia <= 0) {
        this.notificaciones.push({
          mensaje: `El préstamo de "${prestamo.material?.titulo || 'Material sin título'}" está vencido.`,
          tipo: 'vencido'
        });
      }
    });
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { MaterialService } from 'src/app/core/services/Material_Bibliografico.service';
import { Material } from '../../../shared/models/Material_Bibliografico.model';
import { PaginationParams } from 'src/app/core/models/api-response.models';

@Component({
  standalone: true,
  selector: 'app-recent-books-widget',
  imports: [CommonModule, TableModule, RippleModule],
  templateUrl: './recentbookswidget.html',
})
export class RecentBooksWidgetComponent implements OnInit {
  librosSemana: Material[] = [];

  constructor(private materialService: MaterialService) {}

  ngOnInit() {
    const idBiblioteca = '6d4262ea-ec2f-4814-9e1b-dc2b63c5bfe6';
    const pagination: PaginationParams = { page: 1, limit: 10 };

    this.materialService.getMateriales(idBiblioteca, pagination).subscribe({
      next: (data) => {

        this.librosSemana = data.slice(0, 5).map((libro, index) => {
          const portadas = [
            'assets/imagenes/libro1.jpg',
            'assets/imagenes/libro2.jpg',
            'assets/imagenes/libro3.jpg',
            'assets/imagenes/libro4.jpg',
            'assets/imagenes/libro5.jpg',
          ];

          return {
            ...libro,
            portada: portadas[index % portadas.length] 
          };
        });
      },
      error: (err) => console.error('Error cargando libros:', err)
    });
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/imagenes/book-placeholder.png';
  }
}

import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { MaterialService } from 'src/app/core/services/Material_Bibliografico.service';
import { Material } from 'src/app/shared/models/Material_Bibliografico.model';
import { PaginationParams } from 'src/app/core/models/api-response.model';


Chart.register(...registerables);

@Component({
  standalone: true,
  selector: 'app-top-categories-widget',
  imports: [CommonModule],
  templateUrl: './bestsellingwidget.html',
})

export class TopCategoriesWidgetComponent implements OnInit {
  @ViewChild('categoriasChart') categoriasChart!: ElementRef<HTMLCanvasElement>;

  chart: Chart | null = null;
  categorias: { nombre: string; cantidad: number }[] = [];

  constructor(private materialService: MaterialService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    const idBiblioteca = '6d4262ea-ec2f-4814-9e1b-dc2b63c5bfe6';
    const pagination: PaginationParams = { page: 1, limit: 10 };

    this.materialService.getMateriales(idBiblioteca, pagination).subscribe({
      next: (materiales: Material[]) => {
        const conteo: Record<string, number> = {};

        materiales.forEach((mat) => {
          const categoria = mat.categoria?.nombre || 'Sin categoría';
          conteo[categoria] = (conteo[categoria] || 0) + 1;
        });

        this.categorias = Object.entries(conteo)
          .map(([nombre, cantidad]) => ({ nombre, cantidad }))
          .sort((a, b) => b.cantidad - a.cantidad);

        this.renderChart();
      },
      error: (err) => console.error('Error al obtener materiales:', err)
    });
  }

  renderChart(): void {
    const ctx = this.categoriasChart?.nativeElement;
    if (!ctx) return;

    const data = {
      labels: this.categorias.map((c) => c.nombre),
      datasets: [
        {
          label: 'Número de materiales',
          data: this.categorias.map((c) => c.cantidad),
          backgroundColor: [
            '#DDD6FE', 
            '#C4B5FD',
            '#FBCFE8', 
            '#F9A8D4', 
            '#E9D5FF', 
            '#A78BFA', 
            '#F5D0FE'  
          ],

          borderWidth: 1,
          borderRadius: 6,
          barThickness: 30
        }
      ]
    };

    const config: ChartConfiguration = {
      type: 'bar' as ChartType,
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: { color: '#6B7280', font: { size: 12 } },
            grid: { display: false }
          },
          y: {
            ticks: { color: '#6B7280', font: { size: 12 } },
            grid: { color: '#E5E7EB' }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1F2937',
            titleColor: '#F9FAFB',
            bodyColor: '#F3F4F6'
          }
        }
      }
    };

    if (this.chart) this.chart.destroy();
    this.chart = new Chart(ctx, config);
  }
}

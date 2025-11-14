import { Routes } from '@angular/router';
import { Dashboard } from 'src/app/features/dashboard/dashboard';
import { AppLayout } from 'src/app/shared/components/layout/layout.component';

import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { authRoutes } from 'src/app/features/auth/auth.routes';

import { BibliotecaListComponent } from 'src/app/features/biblioteca/biblioteca-list/biblioteca-list.component';
import { CategoriaListComponent } from 'src/app/features/categoria/categoria-list/categoria-list.component';
import { ClienteListComponent } from 'src/app/features/cliente/cliente-list/cliente-list.component';
import { MaterialBibliograficoListComponent } from 'src/app/features/material-bibliografico/material-bibliografico-list/material-bibliografico-list.component';
import { PerfilComponent } from 'src/app/features/perfil/perfil.component';
import { PrestamoListComponent } from 'src/app/features/prestamo/prestamo-list/prestamo-list.component';
import { ReservaListComponent } from 'src/app/features/reserva/reserva-list/reserva-list.component';
import { SancionListComponent } from 'src/app/features/sancion/sancion-list/sancion-list.component';
import { SedeListComponent } from 'src/app/features/sede/sede-list/sede-list.component';
import { UsuarioListComponent } from 'src/app/features/usuario/usuario-list/usuario-list.component';


export const appRoutes: Routes = [
  {
    path: 'auth',
    children: authRoutes,
    //canActivate: [LoginGuard] 
  },

  {
    path: '',
    component: AppLayout,
    canActivate: [AuthGuard], 
    children: [
      { path: '', component: Dashboard },
      { path: 'dashboard', component: Dashboard },

      { path: 'bibliotecas', component: BibliotecaListComponent },
      { path: 'categorias', component: CategoriaListComponent },
      { path: 'clientes', component: ClienteListComponent },
      { path: 'materiales', component: MaterialBibliograficoListComponent },
      { path: 'prestamos', component: PrestamoListComponent },
      { path: 'reservas', component: ReservaListComponent },
      { path: 'sanciones', component: SancionListComponent },
      { path: 'sedes', component: SedeListComponent },
      { path: 'usuarios', component: UsuarioListComponent },
      { path: 'perfil', component: PerfilComponent},
    ]
  },

  { path: '**', redirectTo: 'auth/login' }
];

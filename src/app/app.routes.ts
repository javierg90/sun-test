import { Routes } from '@angular/router';
import { MunicipiosComponent } from './components/municipios/municipios.component';
import { InstitucionesComponent } from './components/instituciones/instituciones.component';
import { GruposComponent } from './components/grupos/grupos.component';
import { SedesComponent } from './components/sedes/sedes.component';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    children: [
      {
        path: 'municipios',
        component: MunicipiosComponent,
      },
      {
        path: 'instituciones',
        component: InstitucionesComponent,
      },
      {
        path: 'grupos',
        component: GruposComponent,
      },
      {
        path: 'sedes',
        component: SedesComponent,
      },
    ],
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];

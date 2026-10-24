import { Routes } from '@angular/router';
import { Inicio } from './pages/inicio/inicio';
import { ComoFunciona } from './pages/como-funciona/como-funciona';

export const routes: Routes = [
  { path: '', component: Inicio, title: 'Athenas System | Início' },
  { path: 'como-funciona', component: ComoFunciona, title: 'Athenas System | Como funciona' },
  { path: '**', redirectTo: '' }
];
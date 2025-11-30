import { Routes } from '@angular/router';
import {ErrorComponent} from './components/error/error.component';
import {PeriodicTable} from './components/periodic-table/periodic-table';

export const routes: Routes = [
  {
    path: '', component: PeriodicTable
  },
  {
    path: '**', component: ErrorComponent
  },
];

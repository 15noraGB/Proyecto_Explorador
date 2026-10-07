import { Routes } from '@angular/router';
import { Index } from './pages/index/index';
import { CountryDetail } from './pages/country-detail/country-detail';

export const routes: Routes = [
  { path: '', component: Index },
  {path: 'country/:code', component: CountryDetail},
  { path: '**', redirectTo: '' }
];
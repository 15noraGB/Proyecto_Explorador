import { Routes } from '@angular/router';
import { Index } from './pages/index/index';
import { CountryDetail } from './pages/country-detail/country-detail';
import { Favorites } from './pages/favorites/favorites';
import { GameComponent} from './pages/game/game';


export const routes: Routes = [
  { path: '', component: Index },
  { path: 'favorites', component: Favorites },
  { path: 'country/:code', component: CountryDetail },
  { path: 'game', component: GameComponent },
  { path: '**', redirectTo: '' },
];
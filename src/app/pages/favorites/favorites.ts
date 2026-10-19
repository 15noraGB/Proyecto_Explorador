import { Component } from '@angular/core';
import { FavoriteService } from '../../service/favorite.service';
import { CountryList } from '../../components/country-list/country-list';


@Component({
  selector: 'app-favorites',
  imports: [CountryList],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class Favorites {
  constructor(public favoriteService: FavoriteService) {}
}

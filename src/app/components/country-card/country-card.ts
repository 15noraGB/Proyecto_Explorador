import { Component, input } from '@angular/core';
import { Country } from '../../models/country';

@Component({
  selector: 'app-country-card',
  imports: [],
  templateUrl: './country-card.html',
  styleUrl: './country-card.css'
})
export class CountryCard {

  country = input<Country>();

}
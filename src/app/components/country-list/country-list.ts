import { Component, input } from '@angular/core';
import { Country } from '../../models/country';
import { CountryCard } from '../country-card/country-card';

@Component({
  selector: 'app-country-list',
  imports: [CountryCard],
  templateUrl: './country-list.html',
  styleUrl: './country-list.css'
})
export class CountryList {

  countries = input<Country[]>([]);

}
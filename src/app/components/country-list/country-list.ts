import { Component, input } from '@angular/core';
import { Country } from '../../models/country';

@Component({
  selector: 'app-country-list',
  imports: [],
  templateUrl: './country-list.html',
  styleUrl: './country-list.css'
})
export class CountryList {

  countries = input<Country[]>([]);

}
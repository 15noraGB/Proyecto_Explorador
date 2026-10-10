import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { Country } from '../../models/country';

@Component({
  selector: 'app-country-card',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './country-card.html',
  styleUrl: './country-card.css'

})
export class CountryCard {

  country = input<Country>();

}
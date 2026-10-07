import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CountryService } from '../../service/country.service';
import { Country } from '../../models/country';

@Component({
  imports: [],
  selector: 'app-country-detail',
  styleUrl: './country-detail.css',
  templateUrl: './country-detail.html',
})
export class CountryDetail {

  code: string = '';
  country?: Country;
  

  constructor(
  private route: ActivatedRoute,
  private countryService: CountryService
) {
  this.code = this.route.snapshot.paramMap.get('code') || '';

  console.log('Código del país:', this.code);

  this.countryService.getCountry(this.code).subscribe({
    next: (country) => {
      this.country = country;
      console.log('País recibido:', country);
    },
    error: (error) => {
      console.error('Error al obtener el país:', error);
    }
  });
}


}
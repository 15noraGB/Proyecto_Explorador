import { Component, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CountryService } from '../../service/country.service';
import { Country } from '../../models/country';


@Component({
  imports: [RouterLink],
  selector: 'app-country-detail',
  styleUrl: './country-detail.css',
  templateUrl: './country-detail.html',
})
export class CountryDetail {

  code: string = '';
  country?: Country;

  constructor(
    private route: ActivatedRoute,
    private countryService: CountryService,
    private cdr: ChangeDetectorRef
  ) {

    this.route.paramMap.subscribe(params => {

      this.code = params.get('code') || '';

      console.log('Código del país:', this.code);

      this.countryService.getCountry(this.code).subscribe({
        next: (country) => {
          this.country = country;
          this.cdr.detectChanges();
          console.log('País recibido:', country);
        },
        error: (error) => {
          console.error('Error al obtener el país:', error);
        }
      });

    });

  }

}
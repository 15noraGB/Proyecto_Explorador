import { Component, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CountryService } from '../../service/country.service';
import { DecimalPipe } from '@angular/common';
import { Country } from '../../models/country';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  imports: [RouterLink, DecimalPipe],
  selector: 'app-country-detail',
  templateUrl: './country-detail.html',
  styleUrl: './country-detail.css',
})
export class CountryDetail {
  code: string = '';
  country?: Country;
  loading: boolean = true;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private countryService: CountryService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {
    this.route.paramMap.subscribe((params) => {
      this.code = params.get('code') || '';

      console.log('Código del país:', this.code);

      this.countryService.getCountry(this.code).subscribe({
        next: (country) => {
          this.country = country;
          this.loading = false;
          this.cdr.detectChanges();
          console.log('País recibido:', country);
        },
        error: (error) => {
          this.errorMessage = 'No se ha podido cargar la información del país.';
          this.loading = false;
          console.error('Error al obtener el país:', error);
        },
      });
    });
  }

  getMapUrl(countryName: string): SafeResourceUrl {
  const url = `https://maps.google.com/maps?q=${encodeURIComponent(countryName)}&t=h&z=4&ie=UTF8&iwloc=&output=embed`;
  return this.sanitizer.bypassSecurityTrustResourceUrl(url);
}
}


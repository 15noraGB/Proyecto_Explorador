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
  code = '';
  country?: Country;
  loading = true;
  errorMessage = '';
  mapUrl?: SafeResourceUrl;
  mapLoading = true;

  constructor(
    private route: ActivatedRoute,
    private countryService: CountryService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {
    this.route.paramMap.subscribe((params) => {
      this.code = params.get('code') || '';
      this.loading = true;
      this.errorMessage = '';
      this.country = undefined;
      this.mapUrl = undefined;
      this.mapLoading = true;

      this.countryService.getCountry(this.code).subscribe({
        next: (country) => {
          this.country = country;
          this.mapUrl = this.getMapUrl(country.name);
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.errorMessage = 'No se ha podido cargar la información del país.';
          this.loading = false;
          console.error('Error al obtener el país:', error);
          this.cdr.detectChanges();
        },
      });
    });
  }

  getMapUrl(countryName: string): SafeResourceUrl {
    const url = `https://maps.google.com/maps?q=${encodeURIComponent(countryName)}&t=h&z=4&ie=UTF8&iwloc=&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  onMapLoad(): void {
    this.mapLoading = false;
    this.cdr.detectChanges();
  }
}
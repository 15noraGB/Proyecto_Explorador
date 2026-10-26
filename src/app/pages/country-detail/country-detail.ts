import { Component, ChangeDetectorRef, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CountryService } from '../../service/country.service';
import { DecimalPipe } from '@angular/common';
import { Country } from '../../models/country';
import Globe from 'globe.gl';

@Component({
  imports: [RouterLink, DecimalPipe],
  selector: 'app-country-detail',
  templateUrl: './country-detail.html',
  styleUrl: './country-detail.css',
})
export class CountryDetail implements OnDestroy {
  @ViewChild('globeContainer') globeContainer?: ElementRef;

  code: string = '';
  country?: Country;
  loading: boolean = true;
  errorMessage: string = '';
  private globeInstance: any;

  constructor(
    private route: ActivatedRoute,
    private countryService: CountryService,
    private cdr: ChangeDetectorRef
  ) {
    this.route.paramMap.subscribe((params) => {
      this.code = params.get('code') || '';

      this.countryService.getCountry(this.code).subscribe({
        next: (country) => {
          this.country = country;
          this.loading = false;
          this.cdr.detectChanges();

          // Inicializamos el globo tras renderizar el DOM
          setTimeout(() => this.initGlobe(), 100);
        },
        error: (error) => {
          this.errorMessage = 'No se ha podido cargar la información del país.';
          this.loading = false;
          console.error('Error al obtener el país:', error);
        },
      });
    });
  }

  private initGlobe(): void {
    if (!this.globeContainer || !this.country) return;

    // 1. Extraemos las coordenadas probando las distintas estructuras típicas de la API
    const c = this.country as any;
    const coords = c.latlng || c.capitalInfo?.latlng || c.coordinates;

    let lat = 0;
    let lng = 0;

    if (Array.isArray(coords) && coords.length >= 2) {
      lat = coords[0];
      lng = coords[1];
    }

    console.log(`Coordenadas de ${this.country.name}:`, lat, lng);

    const container = this.globeContainer.nativeElement;
    const width = container.clientWidth || 600;

    // 2. Instancia del Globo 3D con la palabra 'new'
    this.globeInstance = new Globe(container)
      .width(width)
      .height(400)
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
      .htmlElementsData([{ lat, lng, name: this.country.name }])
      .htmlElement((d: any) => {
        const el = document.createElement('div');
        el.className = 'globe-marker';
        el.innerHTML = `<span class="marker-pulse"></span><span class="marker-label">${d.name}</span>`;
        return el;
      });

    // 3. Apuntar la cámara exactamente a la latitud y longitud del país
    this.globeInstance.pointOfView({ lat, lng, altitude: 1.8 }, 1500);

    // Rotación suave del globo
    this.globeInstance.controls().autoRotate = true;
    this.globeInstance.controls().autoRotateSpeed = 0.5;
  }

  ngOnDestroy(): void {
    if (this.globeInstance && this.globeInstance._destructor) {
      this.globeInstance._destructor();
    }
  }
}
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Country } from '../../models/country';
import { CountryService } from '../../service/country.service';
import { CountryList } from '../../components/country-list/country-list';
import { Footer } from '../../components/footer/footer';
import { Finder } from '../../components/finder/finder';

@Component({
  selector: 'app-index',
  imports: [CountryList, Footer, Finder],
  templateUrl: './index.html',
  styleUrl: './index.css'
})
export class Index implements OnInit {
  countries: Country[] = [];
  filteredCountries: Country[] = [];
  hasSearched = false;
  isLoadingCountries = true;
  countriesError = '';

  constructor(
    private countryService: CountryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.countryService.getCountries().subscribe({
      next: (countries) => {
        this.countries = countries;
        this.filteredCountries = countries;
        this.isLoadingCountries = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading countries:', error);
        this.countriesError = 'No se pudieron cargar los países.';
        this.isLoadingCountries = false;
        this.cdr.markForCheck();
      }
    });
  }

  searchCountry(value: string): void {
    this.hasSearched = true;
    this.filteredCountries = this.countries.filter(country =>
      country.name.toLowerCase().includes(value.toLowerCase())
    );
  }

  showAllCountries(): void {
    this.filteredCountries = [...this.countries];
    this.hasSearched = false;
  }
}
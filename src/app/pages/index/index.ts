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
  readonly initialCountryCount = 12;

  countries: Country[] = [];
  filteredCountries: Country[] = [];
  hasSearched = false;
  showAll = false;
  isLoadingCountries = true;
  countriesError = '';

  constructor(
    private countryService: CountryService,
    private cdr: ChangeDetectorRef
  ) {}

  get visibleCountries(): Country[] {
    if (this.hasSearched || this.showAll) {
      return this.filteredCountries;
    }

    return this.filteredCountries.slice(0, this.initialCountryCount);
  }

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
    const query = value.trim().toLowerCase();

    this.hasSearched = query.length > 0;
    this.showAll = false;
    this.filteredCountries = query
      ? this.countries.filter(country =>
          country.name.toLowerCase().includes(query)
        )
      : [...this.countries];
  }

  toggleCountries(): void {
    this.showAll = !this.showAll;
  }
}
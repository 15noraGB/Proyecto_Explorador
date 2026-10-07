import { Component, OnInit } from '@angular/core';
import { Country } from '../../models/country';
import { CountryService } from '../../service/country.service';
import { CountryList } from '../../components/country-list/country-list';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { Finder } from '../../components/finder/finder';

@Component({
  selector: 'app-index',
  imports: [CountryList, Header, Footer, Finder],
  templateUrl: './index.html',
  styleUrl: './index.css'
})
export class Index implements OnInit {

  countries: Country[] = [];
  filteredCountries: Country[] = [];

  constructor(private countryService: CountryService) {
  }

  ngOnInit(): void {
    this.countryService.getCountries().subscribe({
      next: (countries) => {
        this.countries = countries;
        this.filteredCountries = countries;
        console.log(this.countries);
      },
      error: (error) => {
        console.error('Error loading countries:', error);
      }
    });
  }

  searchCountry(value: string) {
    this.filteredCountries = this.countries.filter(country =>
      country.name.toLowerCase().includes(value.toLowerCase())
    ); 
    }


}
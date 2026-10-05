import { Component, OnInit } from '@angular/core';
import { Country } from '../../models/country';
import { CountryService } from '../../service/country.service';
import { CountryList } from '../../components/country-list/country-list';
import { Header } from '../../components/header/header';

@Component({
  selector: 'app-index',
  imports: [CountryList, Header],
  templateUrl: './index.html',
  styleUrl: './index.css'
})
export class Index implements OnInit {

  countries: Country[] = [];

  constructor(private countryService: CountryService) {
  }

  ngOnInit(): void {
    this.countryService.getCountries().subscribe({
      next: (countries) => {
        this.countries = countries;
        console.log(this.countries);
      },
      error: (error) => {
        console.error('Error loading countries:', error);
      }
    });
  }

}
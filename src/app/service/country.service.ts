import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Country } from '../models/country';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private apiUrl = 'https://countries-api.davegarvey.workers.dev';

  constructor(private http: HttpClient) {
  }

  getCountries() {
  return this.http.get<Country[]>(`${this.apiUrl}/countries`);
}

}
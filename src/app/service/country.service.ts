import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { Country } from '../models/country';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private apiUrl = 'https://countries-api.davegarvey.workers.dev';
  
  private countriesCache: Country[] | null = null;

  constructor(private http: HttpClient) {}

  getCountries(): Observable<Country[]> {
    if (this.countriesCache) {
      return of(this.countriesCache);
    }

    return this.http.get<Country[]>(`${this.apiUrl}/countries`).pipe(
      tap(countries => this.countriesCache = countries)
    );
  }

  getCountry(code: string): Observable<Country> {
    return this.http.get<Country>(`${this.apiUrl}/countries/${code}`);
  }
}
import { Injectable, signal } from '@angular/core';
import { Country } from '../models/country';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private readonly storageKey = 'country-explorer-favorites';

  // Signal con los datos guardados
  favorites = signal<Country[]>(this.getSavedFavorites());

  private getSavedFavorites(): Country[] {
    const savedFavorites = localStorage.getItem(this.storageKey);
    if (!savedFavorites) return [];
    try {
      return JSON.parse(savedFavorites) as Country[];
    } catch {
      return [];
    }
  }

  private saveFavorites(favorites: Country[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(favorites));
    this.favorites.set(favorites); // Actualiza la lista en pantalla
  }

  isFavorite(code: string): boolean {
    return this.favorites().some(country => country.code === code);
  }

  toggleFavorite(country: Country): void {
    const currentFavorites = this.favorites();
    const alreadyFavorite = currentFavorites.some(f => f.code === country.code);

    const updatedFavorites = alreadyFavorite
      ? currentFavorites.filter(f => f.code !== country.code)
      : [...currentFavorites, country];

    this.saveFavorites(updatedFavorites);
  }
}
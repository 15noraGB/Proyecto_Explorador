import { Injectable, signal } from '@angular/core';
import { Country } from '../models/country';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private readonly storageKey = 'country-explorer-favorites';

  // Signal con los datos guardados
  favorites = signal<Country[]>(this.getSavedFavorites());

  // Signal para controlar el mensaje de la notificación flotante
  toastMessage = signal<string | null>(null);

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

    // Notificación emergente al usuario
    if (alreadyFavorite) {
      this.showToast(`${country.name} eliminado de favoritos`);
    } else {
      this.showToast(`${country.name} añadido a favoritos`);
    }
  }

   showToast(message: string): void {
    this.toastMessage.set(message);
    setTimeout(() => {
      this.toastMessage.set(null); // Se oculta a los 3 segundos
    }, 3000);
  }
}
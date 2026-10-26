import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CountryService } from '../../service/country.service';
import { FavoriteService } from '../../service/favorite.service';
import { Country } from '../../models/country';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './game.html',
  styleUrl: './game.css'
})
export class GameComponent implements OnInit {
  private countryService = inject(CountryService);
  private favoriteService = inject(FavoriteService);

  allCountries: Country[] = [];
  currentCountry?: Country;
  options: string[] = [];
  
  score: number = 0;
  streak: number = 0;
  loading: boolean = true;
  selectedOption: string | null = null;
  isCorrect: boolean | null = null;

  ngOnInit(): void {
    this.countryService.getCountries().subscribe({
      next: (countries) => {
        // Filtramos países que tengan código y nombre válidos
        this.allCountries = countries.filter(c => c.code && c.name);
        this.loading = false;
        this.nextQuestion();
      },
      error: (err) => {
        console.error('Error cargando países para el juego:', err);
        this.loading = false;
      }
    });
  }

  nextQuestion(): void {
    if (this.allCountries.length < 4) return;

    this.selectedOption = null;
    this.isCorrect = null;

    // 1. Elegir un país aleatorio como la respuesta correcta
    const randomIndex = Math.floor(Math.random() * this.allCountries.length);
    this.currentCountry = this.allCountries[randomIndex];

    // 2. Elegir 3 opciones incorrectas aleatorias
    const wrongOptions: string[] = [];
    while (wrongOptions.length < 3) {
      const rand = Math.floor(Math.random() * this.allCountries.length);
      const randomName = this.allCountries[rand].name;
      
      if (randomName !== this.currentCountry.name && !wrongOptions.includes(randomName)) {
        wrongOptions.push(randomName);
      }
    }

    // 3. Mezclar la opción correcta con las incorrectas
    this.options = [...wrongOptions, this.currentCountry.name].sort(() => Math.random() - 0.5);
  }

  checkAnswer(option: string): void {
    if (this.selectedOption !== null || !this.currentCountry) return; // Evita doble click

    this.selectedOption = option;

    if (option === this.currentCountry.name) {
      this.isCorrect = true;
      this.score += 10;
      this.streak += 1;
      this.favoriteService.showToast(`¡Correcto! 🎉 +10 pts`);
    } else {
      this.isCorrect = false;
      this.streak = 0;
      this.favoriteService.showToast(`❌ ¡Ups! Era ${this.currentCountry.name}`);
    }

    // Pasar a la siguiente pregunta automáticamente tras 1.5 segundos
    setTimeout(() => {
      this.nextQuestion();
    }, 1500);
  }
}
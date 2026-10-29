import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CountryService } from '../../service/country.service';
import { FavoriteService } from '../../service/favorite.service';
import { Country } from '../../models/country';

// Imports de Signal Forms según el temario
import { form, FormField, submit, required, email } from '@angular/forms/signals';

interface ShareForm {
  playerName: string;
  recipientEmail: string;
  message: string;
}

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [RouterLink, FormField],
  templateUrl: './game.html',
  styleUrl: './game.css'
})
export class GameComponent implements OnInit {
  private countryService = inject(CountryService);
  private favoriteService = inject(FavoriteService);

  allCountries: Country[] = [];
  currentCountry?: Country;
  options: string[] = [];

  // Puntuaciones
  roundScore: number = 0;
  questionNumber: number = 1;
  totalQuestions: number = 5;
  totalLifetimeScore: number = 0;
  highScore: number = 0;

  // Estados del juego
  loading: boolean = true;
  gameOver: boolean = false;
  selectedOption: string | null = null;
  hasAnswered: boolean = false;

  // Signal para el estado de mensaje enviado (como indica la guía del profesor)
  isSent = signal<boolean>(false);

  // Modelo y formulario con Signals
  shareModel = signal<ShareForm>({
    playerName: '',
    recipientEmail: '',
    message: ''
  });

  // Validación centralizada con Signal Forms
  shareForm = form(this.shareModel, (path) => {
    required(path.playerName, { message: 'El nombre es obligatorio' });
    required(path.recipientEmail, { message: 'El email es obligatorio' });
    email(path.recipientEmail, { message: 'Formato de email no válido' });
  });

  ngOnInit(): void {
    this.loadSavedStats();
    this.fetchCountries();

    this.countryService.getCountries().subscribe({
      next: (countries) => {
        this.allCountries = countries.filter(c => c.code && c.name);
        this.loading = false;
        this.startNewGame();
      },
      error: (err) => {
        console.error('Error al cargar países:', err);
        this.loading = false;
      }
    });
  }

  private loadSavedStats(): void {
    this.totalLifetimeScore = Number(localStorage.getItem('game_total_score') || 0);
    this.highScore = Number(localStorage.getItem('game_high_score') || 0);
  }

  startNewGame(): void {
    this.roundScore = 0;
    this.questionNumber = 1;
    this.gameOver = false;
    this.hasAnswered = false;
    this.selectedOption = null;
    this.isSent.set(false); // Reinicia el mensaje del formulario

    // Si ya tenemos los países cargados en memoria, arrancamos la pregunta AL INSTANTE
    if (this.allCountries.length > 0) {
      this.loading = false;
      this.loadQuestion();
    } else {
      // Solo si por alguna razón la lista estuviera vacía, los pedimos
      this.fetchCountries();
    }
  }

  private fetchCountries(): void {
    this.loading = true;
    this.countryService.getCountries().subscribe({
      next: (countries) => {
        this.allCountries = countries.filter(c => c.code && c.name);
        this.loading = false;
        this.loadQuestion();
      },
      error: (err) => {
        console.error('Error al cargar países:', err);
        this.loading = false;
      }
    });
  }

  loadQuestion(): void {
    if (this.allCountries.length < 4) return;

    this.selectedOption = null;
    this.hasAnswered = false;

    const randomIndex = Math.floor(Math.random() * this.allCountries.length);
    this.currentCountry = this.allCountries[randomIndex];

    const wrongOptions: string[] = [];
    while (wrongOptions.length < 3) {
      const rand = Math.floor(Math.random() * this.allCountries.length);
      const randomName = this.allCountries[rand].name;
      if (randomName !== this.currentCountry.name && !wrongOptions.includes(randomName)) {
        wrongOptions.push(randomName);
      }
    }

    this.options = [...wrongOptions, this.currentCountry.name].sort(() => Math.random() - 0.5);
  }

  checkAnswer(option: string): void {
    if (this.hasAnswered || !this.currentCountry) return;

    this.selectedOption = option;
    this.hasAnswered = true;

    if (option === this.currentCountry.name) {
      this.roundScore += 10;
      this.favoriteService.showToast(`¡Correcto! 🎉 +10 pts`);
    } else {
      this.favoriteService.showToast(`❌ Era ${this.currentCountry.name}`);
    }
  }

  nextQuestion(): void {
    if (this.questionNumber < this.totalQuestions) {
      this.questionNumber++;
      this.loadQuestion();
    } else {
      this.finishGame();
    }
  }

  finishGame(): void {
    this.gameOver = true;

    this.totalLifetimeScore += this.roundScore;
    localStorage.setItem('game_total_score', this.totalLifetimeScore.toString());

    if (this.roundScore > this.highScore) {
      this.highScore = this.roundScore;
      localStorage.setItem('game_high_score', this.highScore.toString());
    }
  }

  // ENVÍO DEL FORMULARIO INTERNO
  onSubmitShare(): void {
    submit(this.shareForm, async () => {
      // Marcamos el signal como enviado para cambiar la vista
      this.isSent.set(true);
      this.favoriteService.showToast('✉️ ¡Puntuación compartida con éxito!');
    });
  }
}
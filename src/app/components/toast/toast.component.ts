import { Component, inject } from '@angular/core';
import { FavoriteService } from '../../service/favorite.service';

@Component({
  selector: 'app-toast',
  imports: [ToastComponent],
  templateUrl: './toast.html',
  styleUrl: './toast.css'
})
export class ToastComponent {
  favoriteService = inject(FavoriteService);
}
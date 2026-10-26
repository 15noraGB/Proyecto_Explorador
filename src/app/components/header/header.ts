import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToastComponent } from '../toast/toast.component';


@Component({
  imports: [RouterLink, ToastComponent],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  
}

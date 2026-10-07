import { Component, output } from '@angular/core';

@Component({
  selector: 'app-finder',
  imports: [],
  templateUrl: './finder.html',
  styleUrl: './finder.css'
})
export class Finder {

  search = output<string>();

  searchCountry(value: string){
    this.search.emit(value);
  }

}
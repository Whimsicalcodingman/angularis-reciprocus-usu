import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StoreModule } from '@ngrx/store';

import { Counter } from './features/counter/counter';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Counter, StoreModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ngrxPractice');
}

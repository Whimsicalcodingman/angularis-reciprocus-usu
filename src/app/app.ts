import { Component, signal, } from '@angular/core';
import { StoreModule, } from '@ngrx/store';

import { AppWrapperComponent, } from './components/app-wrapper/app-wrapper.component';

@Component({
  selector: 'app-root',
  imports: [AppWrapperComponent, StoreModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('ngrxPractice');
}

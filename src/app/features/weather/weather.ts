import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-weather',
  imports: [RouterOutlet],
  templateUrl: './weather.html',
  styleUrl: './weather.scss',
})
export class Weather {}

import { GeocodingService } from '#app/domain/weather/openmeteo-geocoding.service';
import { fetchWeatherApi } from 'openmeteo';
import {
  distinctUntilChanged,
  filter,
  map,
  merge,
  Observable,
  of,
  shareReplay,
  startWith,
  Subject,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { Memoize } from 'typescript-memoize';

import { AsyncPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatAutocompleteModule,
  MatOption,
} from '@angular/material/autocomplete';
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { VariablesWithTime } from '@openmeteo/sdk/variables-with-time';
import { WeatherApiResponse } from '@openmeteo/sdk/weather-api-response';

import { GeoCodingResult, GeoCoordinates } from '../../config';
import { OPEN_METEO_CONFIG } from '../../config/weather-data.defaults';
import { DailyWeather, WeatherSearchForm } from '../../domain';
import { WEATHER_LOCATION_OPTIONS } from '../../domain/weather-search-form.const';

@Component({
  selector: 'app-temperature',
  imports: [
    // 3rd party
    AsyncPipe,
    DatePipe,
    DecimalPipe,
    FormsModule,
    ReactiveFormsModule,

    // Material
    MatFormField,
    MatAutocompleteModule,
    MatOption,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
  ],
  templateUrl: './temperature.html',
  styleUrl: './temperature.scss',
})
export class Temperature {
  public readonly locationOptions = WEATHER_LOCATION_OPTIONS;

  private readonly geocodingService = inject(GeocodingService);
  private readonly getWeatherSubject = new Subject<void>();

  public formGroup = new FormGroup<WeatherSearchForm>({
    location: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  public getWeather(): void {
    this.getWeatherSubject.next();
  }

  @Memoize() public get filteredOptions$(): Observable<string[]> {
    return this.formGroup.controls.location.valueChanges.pipe(
      startWith(''),
      map((value) => this.filter(value || '')),
      shareReplay(1),
    );
  }

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.locationOptions.filter((option) =>
      option.toLowerCase().includes(filterValue),
    );
  }

  @Memoize() public get dailyTemperatures$(): Observable<DailyWeather[]> {
    return this.dailyWeatherForecast$.pipe(
      withLatestFrom(this.location$),
      map(([daily, userLocation]) => {
        const variable = daily.variables(0);
        if (!variable) return [];

        const temps = Array.from(daily.variables(0)?.valuesArray() ?? []);

        const startTime = Number(daily.time());
        const interval = daily.interval();
        const offset = 0;

        return temps.map((temperature, i) => ({
          location: userLocation,
          date: new Date((startTime + i * interval + offset) * 1000),
          temperature,
        }));
      }),
      shareReplay(1),
    );
  }

  @Memoize()
  private get dailyWeatherForecast$(): Observable<VariablesWithTime> {
    return this.weatherApiResponse$.pipe(
      map(([weather]) => weather.daily()),
      filter(
        (daily): daily is VariablesWithTime =>
          daily !== null && daily !== undefined,
      ),
      shareReplay(1),
    );
  }

  @Memoize() private get weatherApiResponse$(): Observable<
    WeatherApiResponse[]
  > {
    return this.coordinates$.pipe(
      switchMap((coords) =>
        fetchWeatherApi(OPEN_METEO_CONFIG.api.baseUrl, {
          ...OPEN_METEO_CONFIG.defaults,
          latitude: coords?.latitude,
          longitude: coords?.longitude,
        }),
      ),
      shareReplay(1),
    );
  }

  @Memoize() private get location$(): Observable<string> {
    return merge(this.getWeatherSubject, this.initialLoad$).pipe(
      withLatestFrom(
        this.formGroup.valueChanges.pipe(startWith(this.formGroup.value)),
      ),
      map(([, formValue]) => formValue.location?.trim()),
      filter((location): location is string => !!location),
      distinctUntilChanged(),
      shareReplay(1),
    );
  }

  @Memoize() private get coordinates$(): Observable<GeoCoordinates | null> {
    return this.location$.pipe(
      switchMap((location) =>
        this.geocodingService.getWeatherLocationData(location),
      ),
      map((response) => response.results?.[0]),
      filter((first): first is GeoCodingResult => !!first),
      map((response) => ({
        latitude: response.latitude,
        longitude: response.longitude,
      })),
      distinctUntilChanged(),
    );
  }

  @Memoize() private get initialLoad$(): Observable<void> {
    return of(undefined);
  }
}

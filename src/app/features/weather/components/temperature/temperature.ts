import { GeocodingService } from '#app/domain/weather/openmeteo-geocoding.service';
import { fetchWeatherApi } from 'openmeteo';
import { distinctUntilChanged, filter, map, merge, Observable, of, shareReplay, startWith, Subject, switchMap, withLatestFrom } from 'rxjs';
import { Memoize } from 'typescript-memoize';

import { AsyncPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VariablesWithTime } from '@openmeteo/sdk/variables-with-time';
import { WeatherApiResponse } from '@openmeteo/sdk/weather-api-response';

import { GeoCodingResult, GeoCoordinates } from '../../config';
import { OPEN_METEO_CONFIG } from '../../config/weather-data.defaults';
import { DailyWeather, WeatherSearchForm } from '../../domain';

@Component({
  selector: 'app-temperature',
  imports: [AsyncPipe, DatePipe, DecimalPipe, ReactiveFormsModule],
  templateUrl: './temperature.html',
  styleUrl: './temperature.scss',
})
export class Temperature {
  private readonly geocodingService = inject(GeocodingService);

  private readonly getWeatherSubject = new Subject<void>();

  public formGroup = new FormGroup<WeatherSearchForm>({
    location: new FormControl('The Hague', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  public getWeather(): void {
    this.getWeatherSubject.next();
  }

  @Memoize()
  public get dailyTemperatures$(): Observable<DailyWeather[]> {
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
      shareReplay(1)
    );
  }

  @Memoize()
  private get dailyWeatherForecast$(): Observable<VariablesWithTime> {
    return this.weatherApiResponse$.pipe(
      map(([weather]) => weather.daily()),
      filter(
        (daily): daily is VariablesWithTime =>
          daily !== null && daily !== undefined
      ),
      shareReplay(1)
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
        })
      ),
      shareReplay(1)
    );
  }

  @Memoize() private get location$(): Observable<string> {
    return merge(this.getWeatherSubject, this.initialLoad$).pipe(
      withLatestFrom(
        this.formGroup.valueChanges.pipe(startWith(this.formGroup.value))
      ),
      map(([_, formValue]) => formValue.location?.trim()),
      filter((location): location is string => !!location),
      distinctUntilChanged(),
      shareReplay(1)
    );
  }

  @Memoize() private get coordinates$(): Observable<GeoCoordinates | null> {
    return this.location$.pipe(
      switchMap((location) =>
        this.geocodingService.getWeatherLocationData(location)
      ),
      map((response) => response.results?.[0]),
      filter((first): first is GeoCodingResult => !!first),
      map((response) => ({
        latitude: response.latitude,
        longitude: response.longitude,
      })),
      distinctUntilChanged()
    );
  }

  @Memoize() private get initialLoad$(): Observable<void> {
    return of(undefined);
  }
}

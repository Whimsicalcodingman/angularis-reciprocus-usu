import { GeocodingApiResponse, OPEN_METEO_CONFIG } from '#app/features/weather/config';
import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GeocodingService {
  private readonly httpClient = inject(HttpClient);

  public getWeatherLocationData(
    location: string
  ): Observable<GeocodingApiResponse> {
    return this.httpClient.get<GeocodingApiResponse>(
      `${OPEN_METEO_CONFIG.api.geocodeUrl}/?name=${encodeURIComponent(
        location
      )}&count=1`
    );
  }
}

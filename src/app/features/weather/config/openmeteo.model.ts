export interface OpenMeteoConfig {
  api: ApiEndpoints;
  defaults: ApiParams;
}

export interface ApiEndpoints {
  baseUrl: string;
  geocodeUrl: string;
}

export interface ApiParams {
  latitude: number;
  longitude: number;
  daily: string;
  models: string;
  timezone: string;
}

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface GeoCodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  timezone: string;
}

export interface GeocodingApiResponse {
  results: GeoCodingResult[];
}

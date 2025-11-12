import { OpenMeteoConfig } from './openmeteo.model';

export const OPEN_METEO_CONFIG: OpenMeteoConfig = {
  api: {
    baseUrl: 'https://api.open-meteo.com/v1/forecast',
    geocodeUrl: 'https://geocoding-api.open-meteo.com/v1/search',
  },
  defaults: {
    latitude: 52.52437,
    longitude: 13.41053,
    daily: 'temperature_2m_max',
    models: 'knmi_seamless',
    timezone: 'auto',
  },
};

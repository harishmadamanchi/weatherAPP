import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { WeatherResponse } from '../../interfaces/weather';
import { geocode } from '../../interfaces/geocode';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http: HttpClient) { }

  getWeatherForecast(selectedLocation: geocode) {
    return this.http.get<WeatherResponse>(`${environment.weatherBaseAPIURL}?q=${selectedLocation.name},${selectedLocation.country}&units=metric`)
  }
}

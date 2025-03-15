import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { geocode } from '../../interfaces/geocode';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationsService {

  private http = inject(HttpClient)

  searchLocations(query: string) {
    return this.http.get<geocode[]>(`${environment.geolocationBaseAPIURL}?q=${query}&limit=5`)
  }
}

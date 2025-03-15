import { Pipe, PipeTransform } from '@angular/core';

import { environment } from '../../environments/environment';

@Pipe({
  name: 'weatherIcon',
  standalone: true
})

export class WeatherIconPipe implements PipeTransform {

  transform(icon: string | undefined): string {
    // return the URL with Icon
    return icon ? environment.weatherIconURL.replace('<<ICON>>',icon) : '';
  }
}

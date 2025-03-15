import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { WeatherData } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { RoundPipe, WeatherIconPipe } from '../../pipes';

@Component({
  selector: 'app-weather-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, WeatherIconPipe, RoundPipe],
  templateUrl: './weather-card.component.html',
  styleUrl: './weather-card.component.scss'
})
export class WeatherCardComponent {
  @Input() weatherValue: WeatherData | undefined = undefined;
  @Input() userTimeZone! : string
  
}

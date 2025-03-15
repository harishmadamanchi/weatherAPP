import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';


import { WeatherData, WeatherResponse, geocode } from './interfaces';
import { SearchBarComponent } from "./components/search-bar/search-bar.component";
import { WeatherCardComponent } from './components/weather-card/weather-card.component';
import { DayLabelPipe } from './pipes';
import { WeatherService } from './services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MatTabsModule, SearchBarComponent, WeatherCardComponent, DayLabelPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  selectedLocation = signal<geocode>({} as geocode)
  foreCastedData = signal<WeatherResponse>({} as WeatherResponse);
  private readonly weatherService = inject(WeatherService);
  readonly  searchForm = new FormGroup({
    searchInput : new FormControl('')
  })
  weatherForeCast!: WeatherData[];
  groupedData: { [x: string]: WeatherData[]; } = {};

  groupedDataKeys: string[] = [];
  
  userTimeZone: string;
  private weatherForecastSubscription : Subscription | undefined = undefined

  constructor() {
    this.userTimeZone = this.getUserTimeZone(); // getting user TimeZone

    // on seleted Location changes clearing weatherForeCast, groupedData, groupedDataKeys values
    effect(() => {
      if(this.selectedLocation()) {
        this.weatherForeCast = [];
        this.groupedData = {};
        this.groupedDataKeys = [];
      }
    })
    // on foreCastedData chnages recalculating the weatherForeCast, groupedData, groupedDataKeys values
    effect(()=> {
      const wholeResponse = this.foreCastedData();
      this.weatherForeCast = wholeResponse?.list
      this.groupedData = this.groupData(this.weatherForeCast);
      this.groupedDataKeys = Object.keys(this.groupedData);
    })
  }

  // on click of search button this makes an api call to weather forecast
  getLocationWeatherDetails(selectedLocation: geocode) {
    this.selectedLocation.set(selectedLocation)
    this.weatherForecastSubscription = this.weatherService.getWeatherForecast(selectedLocation).subscribe({
      next : (response: WeatherResponse) => {
        this.foreCastedData.set(response);
      },
      error : (error) => {
        console.log(error)
      },
      complete : () => console.log('complete')
    })
  }


  // grouping the response forecast list based on date
  groupData(weatherForeCast: WeatherData[]) {
    const groupedData = weatherForeCast.reduce((accumulator: { [x: string]: WeatherData[]; }, item: WeatherData) => {
      const extractDate = item.dt_txt.split(" ")[0];
      if(!accumulator[extractDate]) {
        accumulator[extractDate] = [];
      }
      accumulator[extractDate].push(item);
      return accumulator;
    },{})
    return groupedData;
  }

  // function to get user timeZone
  getUserTimeZone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone; 
  }

  ngOnDestroy() {
    //unsubscribe on destroy
    if(this.weatherForecastSubscription) {
      this.weatherForecastSubscription.unsubscribe();
    }
  }
}

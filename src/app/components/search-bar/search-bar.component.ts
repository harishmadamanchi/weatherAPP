import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output, signal, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { geocode } from '../../interfaces/geocode';
import { debounceTime, distinctUntilChanged, filter, Subscription, switchMap } from 'rxjs';
import { LocationsService } from '../../services/locations/locations.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatInputModule, MatAutocompleteModule,MatFormFieldModule, MatButtonModule, MatIconModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class SearchBarComponent {
  @Output() searchEvent = new EventEmitter();
  locationsService = inject(LocationsService)
  searchForm = new FormGroup({
      searchInput : new FormControl('')
  })

  selectedLocation = signal<geocode>({
    name: '',
    lat: 0,
    lon: 0,
    country: '',
    state: '',
    local_names: {}
  })
  autoCompleteResults = signal<geocode[]>([]);
  private searchSubscription: Subscription | undefined = undefined;


  constructor() {
    //listening to the changes in input values and adding a debounce and filtering out empty or null values and avoiding emitting of duplicate immediate Values
    // switchMap to cancel all previous requests and then excute current one
    this.searchSubscription = this.searchForm.get('searchInput')?.valueChanges.pipe(
      debounceTime(500),
      filter((value):value is string => !!value && value.trim() !== ''),
      distinctUntilChanged(),
      switchMap((value : string) => this.locationsService.searchLocations(value))
    ).subscribe({
      next: (result: geocode[]) => {
        this.autoCompleteResults.set(result);
      },
      error: error => console.log('error ::: ',error),
      complete: () => console.log('completed')
    })
  }


  selectedOption(event : any) {
    // on select on option from auto complete
    this.searchForm.patchValue({
      searchInput: event.option.value.name + ', '+ event.option.value.country
    })
    this.selectedLocation.set(event.option.value);
  }

  getLocationWeatherDetails() {
    //emitting the event with seleteclocation to the parent component
    this.searchEvent.emit(this.selectedLocation())
  }

  ngOnDestroy() {
    //unsubscribe on destroy
    if(this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
}

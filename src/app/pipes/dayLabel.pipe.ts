import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dayLabel',
  standalone: true
})
export class DayLabelPipe implements PipeTransform {
  transform(dateString: string): string {
    const givenDate = new Date(dateString); 
    const today = new Date();
    const tomorrow = new Date();
    
    //adding +1 to today Date
    tomorrow.setDate(today.getDate() + 1);
    
    // neutralising the time of the day to 00:00:00:00
    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    givenDate.setHours(0, 0, 0, 0);

    if (givenDate.getTime() === today.getTime()) {
      return "Today"; // if matching the time with today return Today
    } else if (givenDate.getTime() === tomorrow.getTime()) {
      return "Tomorrow"; // if matching the time with Tomorrow return Tomorrow
    } else {
      return givenDate.toLocaleDateString("en-GB", { weekday: "long" }); // if not matching then return Day
    }
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'round',
  standalone: true
})
export class RoundPipe implements PipeTransform {
  transform(value: number | undefined): number {
    return value !== undefined ? Math.round(value) : 0;
  }
}

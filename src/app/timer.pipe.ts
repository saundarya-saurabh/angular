import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timer'
})
export class TimerPipe implements PipeTransform {

  transform(end_date: any): string {

    let currentDate: any = new Date().getTime();

    currentDate = parseInt(currentDate) / 1000

    let diff = (parseInt(end_date) - currentDate);


    if(diff > 0){
      let day: any = diff / (24 * 3600);
  
      diff = diff % (24 * 3600);
      let hour: any = diff / 3600;
  
      diff %= 3600;
      let minutes: any = diff / 60;
  
      diff %= 60;
      let seconds: any = diff;
  
      let a = '';
  
      if (parseInt(day) != 0 && parseInt(day) > 0) {
        a = a + parseInt(day) + ' Days : ';
      }
      if (parseInt(hour) != 0 && parseInt(hour) > 0) {
        a = a + parseInt(hour) + ' Hours : ';
      }
      if (parseInt(minutes) != 0 && parseInt(minutes) > 0) {
        a = a + parseInt(minutes) + ' Mins : ';
      }
      if (parseInt(seconds) != 0 && parseInt(seconds) > 0) {
        a = a + parseInt(seconds) + ' Secs  ';
      }
  
      return a;
    }else{
      return 'Completed';
    }

  }

}

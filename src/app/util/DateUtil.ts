/**
 * Created by Kingsley Ezeokeke on 2/28/2018.
 */
import {Injectable} from "@angular/core";


@Injectable() 
export class DateUtil {
    
    public getTime(timeString:string) {
        return new Date("Thursday, January 1, 1972 " + this.formatTime(timeString)).getTime();
    }

    private formatTime(timeString:string):string {
        let hm = timeString;
        let a = hm.split(":");
        let formattedTime:string = null;

        if(+a[0] == 0) {
            formattedTime = "12:" + a[1] + ":00 AM";
        } else if (+a[0] > 12) {
            formattedTime = (+a[0] - 12) + ":" + a[1] + ":00 PM";
        } else {
            formattedTime = hm + ":00 AM"
        }

        return formattedTime;

    }

    public addZero(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }
}
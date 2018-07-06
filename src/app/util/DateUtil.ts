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

    /**
     * monday
     * @param d
     * @returns {Date}
     */
    public getFirstDayOfCurrentWeek(d)
    {
        let day = d.getDay();
        return new Date(d.getFullYear(), d.getMonth(), d.getDate() + (day == 0?-6:1)-day );
    }

    /**
     * sunday
     * @param d
     * @returns {Date}
     */
    public getLastDayOfCurrentWeek(d)
    {
        let day = d.getDay();
        return new Date(d.getFullYear(), d.getMonth(), d.getDate() + (day == 0?0:7)-day );
    }

    public getFirstDayOfCurrentMonth(d){
        return new Date(d.getFullYear(), d.getMonth(), 1);
    }
    public getLastDayOfCurrentMonth(d){
        return new Date(d.getFullYear(), d.getMonth()+1, 0);
    }

    public getDaysLeft(startTimestamp: number, endTimestamp: number): number {
        let timeDiff = Math.abs(endTimestamp - startTimestamp);

        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }

    public getStartOfDay(date: Date): number {
        date.setHours(0,0,0,0);

        return date.getTime();
    }

    public getEndOfDay(date: Date): number {
        date.setHours(23,59,59,999);

        return date.getTime();
    }
}

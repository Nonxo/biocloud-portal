/**
 * Created by Kingsley Ezeokeke on 2/28/2018.
 */
import {Injectable} from "@angular/core";


@Injectable()
export class DateUtil {

    public getTime(timeString: string) {
        return new Date("Thursday, January 1, 1972 " + this.formatTime(timeString)).getTime();
    }

    private formatTime(timeString: string): string {
        let hm = timeString;
        let a = hm.split(":");
        let formattedTime: string = null;

        if (+a[0] == 0) {
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
    public getFirstDayOfCurrentWeek(d) {
        let day = d.getDay();
        return new Date(d.getFullYear(), d.getMonth(), d.getDate() + (day == 0 ? -6 : 1) - day);
}

    /**
     * sunday
     * @param d
     * @returns {Date}
     */
    public getLastDayOfCurrentWeek(d) {
        let day = d.getDay();
        return new Date(d.getFullYear(), d.getMonth(), d.getDate() + (day == 0 ? 0 : 7) - day);
    }

    public getFirstDayOfCurrentMonth(d) {
        return new Date(d.getFullYear(), d.getMonth(), 1);
    }

    public getLastDayOfCurrentMonth(d) {
        return new Date(d.getFullYear(), d.getMonth() + 1, 0);
    }

    public getDaysLeft(startTimestamp: number, endTimestamp: number): number {
        let timeDiff = endTimestamp - startTimestamp;
        return Math.round(timeDiff / (1000 * 3600 * 24));
    }

    public getStartOfDay(date: Date): number {
        date.setHours(0, 0, 0, 0);

        return date.getTime();
    }

    public getEndOfDay(date: Date): number {
        date.setHours(23, 59, 59, 999);

        return date.getTime();
    }

    public convertDaysToMS(days: number) {
        return (days - 1) * 86400000;
    }

    getPreviousWeekTimeStamp(currentTimeStamp: number) {
        return this.getStartOfDay(new Date(currentTimeStamp - this.convertDaysToMS(7)));
    }

    getPreviousMonthTimeStamp(currentTimeStamp: number) {
        return this.getStartOfDay(new Date(currentTimeStamp - this.convertDaysToMS(this.daysInMonth(new Date(currentTimeStamp).getMonth() + 1, new Date(currentTimeStamp).getFullYear()))));
    }

    getPreviousYearTimeStamp(currentTimeStamp: number) {
        return this.getStartOfDay(new Date(currentTimeStamp - this.convertDaysToMS(this.daysInAyear(new Date(currentTimeStamp).getFullYear()))));
    }

    getFirstDayOfCurrentYear(d: Date) {
        return new Date(d.getFullYear(), 0, 1);
    }

    getLastDayOfCurrentYear(d: Date) {
        return new Date(d.getFullYear() + 1, 0, 0);
    }

    getDayOfYear() {
        let now: any = new Date();
        let start: any = new Date(now.getFullYear(), 0, 0);
        let diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
        let oneDay = 1000 * 60 * 60 * 24;
        let day = Math.floor(diff / oneDay);
        console.log('Day of year: ' + day);
    }

    isLeapYear(year) {
        return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
    }

    daysInAyear(year) {
        return this.isLeapYear(year) ? 366 : 365;
    }

    daysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }

    weeksInAmonth(month, year) {
        return Math.ceil(this.daysInMonth(month, year)/7);
    }

    getFirstDayOfAweek(year: number, month: number, week: number) {
        let firstDateOfMonth = new Date(year, month - 1, 1); // Date: year-month-01

        let firstDayOfMonth = firstDateOfMonth.getDay() - 1;     // 0 (Sun) to 6 (Sat)

        let firstDateOfWeek = new Date(firstDateOfMonth);    // copy firstDateOfMonth

        firstDateOfWeek.setDate(                             // move the Date object
            firstDateOfWeek.getDate() +                      // forward by the number of
            (firstDayOfMonth ? 7 - firstDayOfMonth : 0)      // days needed to go to
        );                                                   // Sunday, if necessary

        firstDateOfWeek.setDate(                             // move the Date object
            firstDateOfWeek.getDate() +                      // forward by the number of
            7 * (week - 1)                                   // weeks required (week - 1)
        );

        return firstDateOfWeek;
    }

    getDateString(date: Date) {
        let month = this.addZero((date.getMonth() + 1)),
            day = this.addZero(date.getDate()),
            year = date.getFullYear();

        return [year, month, day].join('-');
    }

    /**
     * returns timeStamp
     */
    getTimeStamp(date: Date): number {
        return date.getTime();
    }

    convertMinutesToMS(minutes: number) {
        return minutes * 60 * 1000;
    }

}

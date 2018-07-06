import {NativeDateAdapter} from "@angular/material";
import {DateUtil} from "../DateUtil";

const dateUtil = new DateUtil();

export class MyDateAdapter extends NativeDateAdapter {

    format(date: Date, displayFormat: Object): string {
            const day = dateUtil.addZero(date.getDate());
            const month = dateUtil.addZero(date.getMonth() + 1);
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;

    }
}

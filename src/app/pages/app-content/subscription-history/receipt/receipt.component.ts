/**
 * Created by Kingsley Ezeokeke on 4/24/2018.
 */

import {AfterViewInit, Component, OnDestroy, OnInit} from "@angular/core";
import {DataService} from "../../../../service/data.service";
import {Router} from "@angular/router";
import {StorageService} from "../../../../service/storage.service";
import {PictureUtil} from "../../../../util/PictureUtil";

declare var jsPDF: any;

@Component({
    selector: '',
    templateUrl: './receipt.component.html'
})

export class ReceiptComponent implements OnInit, OnDestroy {

    public history: any;
    public companyName: string;
    public date: number;
    public base64Img: string;
    public description: string;
    public vatAmount: number;

    constructor(private ds: DataService,
                private router: Router,
                private ss: StorageService,
                private pictureUtil: PictureUtil) {
        this.companyName = this.ss.getSelectedOrg().name;
        this.date = new Date().getTime();
    }

    ngOnInit() {
        if (!this.ds.getSubHistory()) {
            this.router.navigate(["/portal/subscription-history"]);
        }

        this.history = this.ds.getSubHistory();
        this.description = (this.history.billingCycle == 'MONTHLY' ? 'Monthly Subscription, ' : 'Annual Subscription, ') + this.history.planName + ' Plan';


        this.pictureUtil.imageToBase64('../../../../../assets/img/logos-bc.png', (img) => {
            this.base64Img = img;
            this.download();
        });
    }

    download() {
        let columns = [
            {title: "QTY", dataKey: "qty"},
            {title: "Description", dataKey: "desc"},
            {title: "Currency", dataKey: "currency"},
            {title: "Amount", dataKey: "amount"}
        ]
        let rows = [
            {
                "qty": 1,
                "desc": this.description,
                "currency": this.history.currency,
                "amount": ((this.history.currency == 'NGN')? (this.history.amountPaid - this.history.vat): this.history.amountPaid)
            }
        ];

        let base64Img = this.base64Img;


        var doc = new jsPDF('p', 'pt', 'a4');
        // var elem = document.getElementById("receipt");

        // doc.setFontSize(30);
        // doc.setTextColor(40);
        //
        // doc.text('INVOICE', 400, 80);

        doc.setFontSize(15);
        doc.text('INVOICE NO: ' + this.history.reference, 300, 100);

        if (base64Img) {
            doc.addImage(base64Img, 'JPEG', 40, 130, 80, 25);
        }

        doc.setFontSize(25);
        doc.text('Bill To:', 40, 200);

        doc.setFontSize(12);
        doc.text(this.companyName, 40, 220);

        doc.setFontSize(25);
        doc.text('Date:', 230, 200);

        doc.setFontSize(12);
        doc.text(new Date().getDate() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getFullYear(), 230, 220);

        doc.setFontSize(25);
        doc.text('Terms:', 430, 200);

        doc.setFontSize(15);
        doc.text('Paid', 430, 220);

        doc.setFontSize(50);

        doc.autoTable(columns, rows, {
            styles: {fillColor: [128, 0, 128]},
            margin: {top: 270},
            columnStyles: {
                id: {fillColor: 255}
            }
        });

        if(this.history.vat > 0 && this.history.currency == 'NGN') {
            doc.setFontSize(10);
            doc.text('VAT', 340, 335);

            doc.setFontSize(10);
            doc.text(this.history.currency + " " + String(this.history.vat), 390, 335);
        }

        doc.setFontSize(12);
        doc.text('Total', 340, 355);

        doc.setFontSize(12);
        doc.text(this.history.currency + " " + String(this.history.amountPaid), 390, 355);

        doc.setFontSize(11);
        doc.text('Thank you for subscribing', 240, 380);

        doc.setFontSize(11);
        doc.text('support@iclocker.com', 250, 410);

        doc.setFontSize(11);
        doc.text('09027816732', 260, 440);

        // doc.fromHTML(document.getElementById("ret"), 10, 300, {
        // }, function() {
        //     doc.save("receipt.pdf");
        // });

        // doc.rect(100, 2, 50, 50);

        doc.save("receipt.pdf");

        // doc.fromHTML(elem, 15, 15, {
        // }, function() {
        //     doc.save("receipt.pdf");
        // });
    }

    goBack() {
        this.router.navigate(['/portal/subscribe']);
    }

    ngOnDestroy() {
        this.ds.setSubHistory(null);
    }
}

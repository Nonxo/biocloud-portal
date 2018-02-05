import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  specific_loc_input: boolean;
  country:boolean;
  state:boolean;
  resumption:boolean;

  locationTypes =[
    {value:"SPECIFIC_LOCATION", name:"Specific Address" },
    {value:"COUNTRY", name:"country"},
    {value:"STATE", name:"state"},
  ]

  locationChange(input){
    switch (input.value) {
      case "SPECIFIC_LOCATION": {
        this.resumption =true;
        this.state = false;
        this.country = false;
        this.specific_loc_input=true;
        break;
      }
      case "COUNTRY": {
        this.resumption =true;
        this.state = false;
        this.country = true;
        this.specific_loc_input=false;
        break;
      }
      case "STATE": {
        this.resumption =true;
        this.state = true;
        this.country = true;
        this.specific_loc_input=false;
        break;
      }
      default: {
        this.resumption = false;
        this.state = false;
        this.country = false;
        this.specific_loc_input=false;
        break;
      }
    }
    
  }


}

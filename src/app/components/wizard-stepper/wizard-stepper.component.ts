import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wizard-stepper',
  templateUrl: './wizard-stepper.component.html',
  styleUrls: ['./wizard-stepper.component.css']
})
export class WizardStepperComponent implements OnInit {


    tab1: boolean = true;
    tab2: boolean = false;


  constructor() { }

  ngOnInit() {
  }

  switcher(choosenTab){
      if(choosenTab === 'tab2'){
          this.tab1 = false;
          this.tab2 = true;
      }
      else{
        this.tab1 = true;
        this.tab2 = false;
      }
  }

}

import { Component } from '@angular/core';
import {Angulartics2Facebook} from "angulartics2";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private a: Angulartics2Facebook) {
      // a.eventTrack('','');
  }
}

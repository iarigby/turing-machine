import {Component, Input, OnInit} from '@angular/core';
import {State} from '../classes/State';
import {Rule} from '../app.component';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.css'],
})
export class StateComponent implements OnInit {

  @Input() state: State;
  @Input() currentRule: Rule;
  constructor() {
  }

  ngOnInit() {
  }


}

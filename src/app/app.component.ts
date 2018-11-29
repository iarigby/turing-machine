import { Component } from '@angular/core';
import {State} from './classes/State';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  turingMachine = new TuringMachine();
  showFormat = false;
  timeoutTime = 500;
  evaluate(string) {
    this.turingMachine.restart();
    this.turingMachine.inputTape.evaluationString = string;
    setTimeout(() => this.run(), this.timeoutTime);
  }
  run() {
    if (!this.turingMachine.finished) {
      this.turingMachine.run();
      setTimeout(() => this.run(), this.timeoutTime);
    }
  }
  decreaseTime() {
    if (this.timeoutTime > 110) {
      this.timeoutTime -= 100;
    }
  }
  increaseTime() {
    this.timeoutTime += 100;
  }
}

export class TuringMachine {
  inputTape = new Tape();
  numTapes = 1;
  tapes = [this.inputTape];
  startState = new State('q0');
  states = [this.startState, new State('q1')];
  currentState = this.startState;
  finalMessage;
  rule;
  finished = false;
  constructor() {
  }
  increaseTapes() {
    this.numTapes += 1;
    this.tapes.push(new Tape());
  }
  decreaseTapes() {
    if (this.numTapes > 0) {
      this.numTapes -= 1;
      this.tapes.pop();
    }
  }
  restart() {
    this.currentState = this.startState;
    this.finalMessage = '';
    this.tapes.forEach(tape => tape.reset());
  }
  run() {
    this.rule = null;
    this.rule = this.findMatchingRule();
    if (this.rule) {
      for (let i = 0; i < this.tapes.length; i++) {
        this.tapes[i].processRule(this.rule, i);
      }
      this.currentState = this.rule.nextState;
    } else {
      this.finished = true;
      this.finalMessage = this.currentState.isAcceptState ? 'accepted' : 'rejected';
    }
  }
  addRule(state, string: string) {
    const nextState = this.states.find(
      x => x.name === string.substr(3 * this.numTapes, 2)) || state;
    state.rules.push(new Rule(string, nextState, this.numTapes));
  }
  addState(stateName) {
    this.states.push(new State(stateName));
  }
  findMatchingRule() {
    return this.currentState.rules.find(x => {
      for (let i = 0; i < this.numTapes; i++) {
        if (!(x.read[i] === this.tapes[i].getCurrentChar())) {
          return false;
        }
      }
      return true;
    });
  }
}

export class Tape {
  evaluationString = '_';
  currentIndex = 0;
  static setCharAt(str, index, chr) {
    return str.substr(0, index) + chr + str.substr(index + 1);
  }
  processRule(rule, i) {
    this.evaluationString = Tape.setCharAt(this.evaluationString, this.currentIndex, rule.replace[i]);
    if (rule.move[i] === 'R') {
      this.moveRight();
    } else if (rule.move[i] === 'L') {
      this.moveLeft();
    }
  }
  getCurrentChar() {
    return this.evaluationString[this.currentIndex];
  }
  moveRight() {
    const last = this.evaluationString.length;
    const isLast = this.currentIndex === last;
    const isbeforeLast = this.currentIndex === last - 1 && this.evaluationString[last] !== '_';
    if (isLast || isbeforeLast) {
      this.evaluationString = this.evaluationString + '_';
    }
    this.currentIndex += 1;
  }
  moveLeft() {
    if (this.currentIndex === 0 || this.currentIndex === 1 && this.evaluationString[0] !== '_') {
      this.evaluationString = '_' + this.evaluationString;
    } else {
      this.currentIndex -= 1;
    }
  }
  reset() {
    this.evaluationString = '_';
    this.currentIndex = 0;
  }
}


export class Rule {
  read: string[];
  replace: string[];
  move: string[];
  nextState: State;
  constructor(s, nextState, tapes) {
    this.read = s.substr(0, tapes).split('');
    this.replace = s.substr(tapes, tapes).split('');
    this.move = s.substr(tapes * 2, tapes).split('');
    this.nextState = nextState;
  }
}


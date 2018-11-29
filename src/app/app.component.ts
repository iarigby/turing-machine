import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  terminals = ['_'];
  turingMachine = new TuringMachine();
  showFormat = false;

  addTerminal(terminal) {
    this.terminals.push(terminal);
  }
  removeTerminal(terminal) {
    const n = this.terminals.indexOf(terminal);
    this.terminals.splice(n, n + 1);
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
  timeoutTime = 500;
  rule;
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
  evaluate(string) {
    this.restart();
    this.inputTape.evaluationString = string;
    setTimeout(() => this.run(), this.timeoutTime);
  }
  decreaseTime() {
    if (this.timeoutTime > 110) {
      this.timeoutTime -= 100;
    }
  }
  increaseTime() {
    this.timeoutTime += 100;
  }
  restart() {
    this.currentState = this.startState;
    this.finalMessage = '';
    this.tapes.forEach(tape => tape.reset());
  }
  run() {
    this.rule = null;
    this.rule = this.currentState.rules.find(x => x.read[0] === this.inputTape.getCurrentChar());
    console.log(this.inputTape.getCurrentChar());
    if (this.rule) {
      for (let i = 0; i < this.tapes.length; i++) {
        this.tapes[i].processRule(this.rule, i);
      }
      this.currentState = this.rule.nextState;
      setTimeout(() => this.run(), this.timeoutTime);
    } else {
      this.finalMessage = this.currentState.isAcceptState ? 'accepted' : 'rejected';
    }
  }
  addRule(state, string) {
    const nextState = this.states.find(
      x => x.name === string.substring(3 * this.numTapes, 5)) || state;
    state.rules.push(new Rule(string, nextState, this.numTapes));
  }
  addState(stateName) {
    this.states.push(new State(stateName));
  }
}

export class Tape {
  evaluationString = '_';
  currentIndex = 0;
  processRule(rule, i) {
    this.evaluationString = this.setCharAt(this.evaluationString, this.currentIndex, rule.replace[i]);
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
    if (this.currentIndex === this.evaluationString.length - 1) {
      this.evaluationString = this.evaluationString + '_';
    }
    this.currentIndex += 1;
  }
  moveLeft() {
    if (this.currentIndex === 1) {
      this.evaluationString = '_' + this.evaluationString;
    } else {
      this.currentIndex -= 1;
    }
  }
  reset() {
    this.evaluationString = '_';
    this.currentIndex = 0;
  }
  setCharAt(str, index, chr) {
    return str.substr(0, index) + chr + str.substr(index + 1);
  }
}
export class State {
  name;
  rules = [];
  isAcceptState = false;
  constructor(name) {
    this.name = name;
  }
  toggleAccept() {
    this.isAcceptState = !this.isAcceptState;
  }
  removeRule(rule) {
    const n = this.rules.indexOf(rule);
    this.rules.splice(n, n + 1);
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
  comprehend(string: string, ith, times): string[] {
    return Array.from(Array(times / ith).keys())
      .map((x, i) => string[i * ith + ith]);
  }
}

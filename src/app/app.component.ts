import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  terminals = ['_'];
  turingMachine = new TuringMachine();

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
  otherTapes = [new Tape(), new Tape()];
  startState = new State('q0');
  states = [this.startState, new State('q1')];
  currentState = this.startState;
  finalMessage;
  timeoutTime = 1000;
  rule;
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
  }
  run() {
    this.rule = null;
    this.rule = this.currentState.rules.find(x => x.read === this.inputTape.getCurrentChar());
    console.log(this.inputTape.getCurrentChar());
    if (this.rule) {
      this.inputTape.processRule(this.rule);
      this.currentState = this.rule.nextState;
      setTimeout(() => this.run(), this.timeoutTime);
    } else {
      this.finalMessage = this.currentState.isAcceptState ? 'accepted' : 'rejected';
    }
  }
  addRule(state, string) {
    const nextState = this.states.find(
      x => x.name === string.substring(3 * this.numTapes, 5)) || state;
    state.rules.push(new Rule(string, nextState));
  }
  addState(stateName) {
    this.states.push(new State(stateName));
  }
}

export class Tape {
  evaluationString = '';
  currentIndex = 0;
  processRule(rule) {
    this.evaluationString = this.setCharAt(this.evaluationString, this.currentIndex, rule.replace);
    rule.move === 'R' ? this.moveRight() : this.moveLeft();
  }
  getCurrentChar() {
    return this.evaluationString[this.currentIndex];
  }
  moveRight() {
    if (this.currentIndex === this.evaluationString.length) {
      this.evaluationString = this.evaluationString + '_';
    }
    this.currentIndex += 1;
  }
  moveLeft() {
    if (this.currentIndex === 0) {
      this.evaluationString = '_' + this.evaluationString;
    } else {
      this.currentIndex -= 1;
    }
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
  read;
  replace;
  move;
  nextState;
  constructor(s, nextState) {
    this.read = s[0];
    this.replace = s[1];
    this.move = s[2];
    this.nextState = nextState;
  }
}

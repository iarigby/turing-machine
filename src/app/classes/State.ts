import {Rule} from '../app.component';

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
  addRule(string, nextState) {
    this.rules.push(new Rule(string, nextState));
  }
  removeRule(rule) {
    const n = this.rules.indexOf(rule);
    this.rules.splice(n, n + 1);
  }
  findMatchingRule(readSymbols) {
    return this.rules.find(x => {
      return x.read
        .map((symbol, index) => symbol === readSymbols[index])
        .reduce((a, b) => a && b);
    });
  }
}

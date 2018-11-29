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

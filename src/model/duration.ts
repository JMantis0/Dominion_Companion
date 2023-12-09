import { DurationName } from "../utils";

export class Duration {
  age: number = 0;
  name: DurationName;
  constructor(name: DurationName) {
    this.name = name;
  }
  getAge(): number {
    return this.age;
  }
  setAge(age: number) {
    this.age = age;
  }
  getName(): DurationName {
    return this.name;
  }
  setName(name: DurationName): void {
    this.name = name;
  }
}

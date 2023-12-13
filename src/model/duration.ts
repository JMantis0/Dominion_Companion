import { DurationName } from "../utils";
import { duration_constants } from "../utils/durations";

export class Duration {
  age: number | undefined = 0;
  name: DurationName;
  setAside: string[] = [];
  constructor(name: DurationName, age?: number) {
    this.name = name;
    if (age !== undefined) {
      this.age = age;
    } else this.age = duration_constants[name].LIFESPAN;
  }
  getAge(): number | undefined {
    return this.age;
  }
  setAge(age: number | undefined) {
    this.age = age;
  }
  getName(): DurationName {
    return this.name;
  }
  setName(name: DurationName): void {
    this.name = name;
  }
  getSetAside(): string[] {
    return this.setAside;
  }
  setSetAside(setAside: string[]) {
    this.setAside = setAside;
  }
}

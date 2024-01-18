import { DurationName } from "../utils";
import { duration_constants } from "../utils/durations";

export class Duration {
  age: number | undefined | "unset" = 0;
  name: DurationName;
  playSource: string | Duration = "unset";
  sourceOf: string = "unset";
  constructor(
    name: DurationName,
    options?: { playSource?: string | Duration; age?: number }
  ) {
    this.name = name;
    if (options !== undefined && options.playSource !== undefined) {
      this.playSource = options.playSource;
    }
    if (options !== undefined && options.age !== undefined) {
      this.age = options.age;
    } else this.age = duration_constants[name].LIFESPAN;
  }
  getAge(): number | undefined | "unset" {
    return this.age;
  }
  setAge(age: number | undefined | "unset") {
    this.age = age;
  }
  getName(): DurationName {
    return this.name;
  }
  setName(name: DurationName): void {
    this.name = name;
  }
  getPlaySource(): string | Duration {
    return this.playSource;
  }
  setPlaySource(card: string) {
    this.playSource = card;
  }
  getSourceOf(): string {
    return this.sourceOf;
  }
  setSourceOf(source: string) {
    this.sourceOf = source;
  }
}

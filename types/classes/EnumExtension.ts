export class EnumExtension {
  // eslint-disable-next-line no-empty-function
  private constructor() {}

  static getValues(e: any) {
    return Object.keys(e)
      .map((key) => e[key])
      .filter((value) => typeof value === 'number') as number[];
  }
}

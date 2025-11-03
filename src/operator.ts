type OperatorValuesSingle = string | number | boolean;
export type OperatorValuesList = string[] | number[] | boolean[] | any[];
export type OperatorValues = OperatorValuesSingle | OperatorValuesList;

export enum Condition {
  Equal = "equal",
  NotEqual = "notEqual",
  GreaterThan = "greaterThan",
  GreaterThanEqual = "greaterThanEqual",
  LessThan = "lessThan",
  LessThanEqual = "lessThanEqual",
  Contains = "contains",
  IsNull = "isNull",
  IsNotNull = "isNotNull",
}

/**
 * Helper class to generate operator strings for atomic operations.
 */
export class Operator {
  method: string;
  values: OperatorValuesList | undefined;

  /**
   * Constructor for Operator class.
   *
   * @param {string} method
   * @param {OperatorValues} values
   */
  constructor(
    method: string,
    values?: OperatorValues
  ) {
    this.method = method;

    if (values !== undefined) {
      if (Array.isArray(values)) {
        this.values = values;
      } else {
        this.values = [values] as OperatorValuesList;
      }
    }
  }

  /**
   * Convert the operator object to a JSON string.
   *
   * @returns {string}
   */
  toString(): string {
    return JSON.stringify({
      method: this.method,
      values: this.values,
    });
  }

  /**
   * Increment a numeric attribute by a specified value.
   *
   * @param {number} value
   * @param {number} max
   * @returns {string}
   */
  static increment = (value: number = 1, max?: number): string => {
    if (isNaN(value) || !isFinite(value)) {
      throw new Error("Value cannot be NaN or Infinity");
    }
    if (max !== undefined && (isNaN(max) || !isFinite(max))) {
      throw new Error("Max cannot be NaN or Infinity");
    }
    const values: any[] = [value];
    if (max !== undefined) {
      values.push(max);
    }
    return new Operator("increment", values).toString();
  };

  /**
   * Decrement a numeric attribute by a specified value.
   *
   * @param {number} value
   * @param {number} min
   * @returns {string}
   */
  static decrement = (value: number = 1, min?: number): string => {
    if (isNaN(value) || !isFinite(value)) {
      throw new Error("Value cannot be NaN or Infinity");
    }
    if (min !== undefined && (isNaN(min) || !isFinite(min))) {
      throw new Error("Min cannot be NaN or Infinity");
    }
    const values: any[] = [value];
    if (min !== undefined) {
      values.push(min);
    }
    return new Operator("decrement", values).toString();
  };

  /**
   * Multiply a numeric attribute by a specified factor.
   *
   * @param {number} factor
   * @param {number} max
   * @returns {string}
   */
  static multiply = (factor: number, max?: number): string => {
    if (isNaN(factor) || !isFinite(factor)) {
      throw new Error("Factor cannot be NaN or Infinity");
    }
    if (max !== undefined && (isNaN(max) || !isFinite(max))) {
      throw new Error("Max cannot be NaN or Infinity");
    }
    const values: any[] = [factor];
    if (max !== undefined) {
      values.push(max);
    }
    return new Operator("multiply", values).toString();
  };

  /**
   * Divide a numeric attribute by a specified divisor.
   *
   * @param {number} divisor
   * @param {number} min
   * @returns {string}
   */
  static divide = (divisor: number, min?: number): string => {
    if (isNaN(divisor) || !isFinite(divisor)) {
      throw new Error("Divisor cannot be NaN or Infinity");
    }
    if (min !== undefined && (isNaN(min) || !isFinite(min))) {
      throw new Error("Min cannot be NaN or Infinity");
    }
    if (divisor === 0) {
      throw new Error("Divisor cannot be zero");
    }
    const values: any[] = [divisor];
    if (min !== undefined) {
      values.push(min);
    }
    return new Operator("divide", values).toString();
  };

  /**
   * Apply modulo operation on a numeric attribute.
   *
   * @param {number} divisor
   * @returns {string}
   */
  static modulo = (divisor: number): string => {
    if (isNaN(divisor) || !isFinite(divisor)) {
      throw new Error("Divisor cannot be NaN or Infinity");
    }
    if (divisor === 0) {
      throw new Error("Divisor cannot be zero");
    }
    return new Operator("modulo", [divisor]).toString();
  };

  /**
   * Raise a numeric attribute to a specified power.
   *
   * @param {number} exponent
   * @param {number} max
   * @returns {string}
   */
  static power = (exponent: number, max?: number): string => {
    if (isNaN(exponent) || !isFinite(exponent)) {
      throw new Error("Exponent cannot be NaN or Infinity");
    }
    if (max !== undefined && (isNaN(max) || !isFinite(max))) {
      throw new Error("Max cannot be NaN or Infinity");
    }
    const values: any[] = [exponent];
    if (max !== undefined) {
      values.push(max);
    }
    return new Operator("power", values).toString();
  };

  /**
   * Append values to an array attribute.
   *
   * @param {any[]} values
   * @returns {string}
   */
  static arrayAppend = (values: any[]): string =>
    new Operator("arrayAppend", values).toString();

  /**
   * Prepend values to an array attribute.
   *
   * @param {any[]} values
   * @returns {string}
   */
  static arrayPrepend = (values: any[]): string =>
    new Operator("arrayPrepend", values).toString();

  /**
   * Insert a value at a specific index in an array attribute.
   *
   * @param {number} index
   * @param {any} value
   * @returns {string}
   */
  static arrayInsert = (index: number, value: any): string =>
    new Operator("arrayInsert", [index, value]).toString();

  /**
   * Remove a value from an array attribute.
   *
   * @param {any} value
   * @returns {string}
   */
  static arrayRemove = (value: any): string =>
    new Operator("arrayRemove", [value]).toString();

  /**
   * Remove duplicate values from an array attribute.
   *
   * @returns {string}
   */
  static arrayUnique = (): string =>
    new Operator("arrayUnique", []).toString();

  /**
   * Keep only values that exist in both the current array and the provided array.
   *
   * @param {any[]} values
   * @returns {string}
   */
  static arrayIntersect = (values: any[]): string =>
    new Operator("arrayIntersect", values).toString();

  /**
   * Remove values from the array that exist in the provided array.
   *
   * @param {any[]} values
   * @returns {string}
   */
  static arrayDiff = (values: any[]): string =>
    new Operator("arrayDiff", values).toString();

  /**
   * Filter array values based on a condition.
   *
   * @param {Condition} condition
   * @param {any} value
   * @returns {string}
   */
  static arrayFilter = (condition: Condition, value?: any): string => {
    const values: any[] = [condition as string, value === undefined ? null : value];
    return new Operator("arrayFilter", values).toString();
  };

  /**
   * Concatenate a value to a string or array attribute.
   *
   * @param {any} value
   * @returns {string}
   */
  static stringConcat = (value: any): string =>
    new Operator("stringConcat", [value]).toString();

  /**
   * Replace occurrences of a search string with a replacement string.
   *
   * @param {string} search
   * @param {string} replace
   * @returns {string}
   */
  static stringReplace = (search: string, replace: string): string =>
    new Operator("stringReplace", [search, replace]).toString();

  /**
   * Toggle a boolean attribute.
   *
   * @returns {string}
   */
  static toggle = (): string =>
    new Operator("toggle", []).toString();

  /**
   * Add days to a date attribute.
   *
   * @param {number} days
   * @returns {string}
   */
  static dateAddDays = (days: number): string =>
    new Operator("dateAddDays", [days]).toString();

  /**
   * Subtract days from a date attribute.
   *
   * @param {number} days
   * @returns {string}
   */
  static dateSubDays = (days: number): string =>
    new Operator("dateSubDays", [days]).toString();

  /**
   * Set a date attribute to the current date and time.
   *
   * @returns {string}
   */
  static dateSetNow = (): string =>
    new Operator("dateSetNow", []).toString();
}

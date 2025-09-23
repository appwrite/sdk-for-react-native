type QueryTypesSingle = string | number | boolean;
export type QueryTypesList = string[] | number[] | boolean[] | Query[] | any[];
export type QueryTypes = QueryTypesSingle | QueryTypesList;
type AttributesTypes = string | string[];

export class Query {
  method: string;
  attribute: AttributesTypes | undefined;
  values: QueryTypesList | undefined;

  constructor(
    method: string,
    attribute?: AttributesTypes,
    values?: QueryTypes
  ) {
    this.method = method;
    this.attribute = attribute;

    if (values !== undefined) {
      if (Array.isArray(values)) {
        this.values = values;
      } else {
        this.values = [values] as QueryTypesList;
      }
    }
  }

  toString(): string {
    return JSON.stringify({
      method: this.method,
      attribute: this.attribute,
      values: this.values,
    });
  }

  static equal = (attribute: string, value: QueryTypes): string =>
    new Query("equal", attribute, value).toString();

  static notEqual = (attribute: string, value: QueryTypes): string =>
    new Query("notEqual", attribute, value).toString();

  static lessThan = (attribute: string, value: QueryTypes): string =>
    new Query("lessThan", attribute, value).toString();

  static lessThanEqual = (attribute: string, value: QueryTypes): string =>
    new Query("lessThanEqual", attribute, value).toString();

  static greaterThan = (attribute: string, value: QueryTypes): string =>
    new Query("greaterThan", attribute, value).toString();

  static greaterThanEqual = (attribute: string, value: QueryTypes): string =>
    new Query("greaterThanEqual", attribute, value).toString();

  static isNull = (attribute: string): string =>
    new Query("isNull", attribute).toString();

  static isNotNull = (attribute: string): string =>
    new Query("isNotNull", attribute).toString();

  static between = (attribute: string, start: string | number, end: string | number) =>
    new Query("between", attribute, [start, end] as QueryTypesList).toString();

  static startsWith = (attribute: string, value: string): string =>
    new Query("startsWith", attribute, value).toString();

  static endsWith = (attribute: string, value: string): string =>
    new Query("endsWith", attribute, value).toString();

  static select = (attributes: string[]): string =>
    new Query("select", undefined, attributes).toString();

  static search = (attribute: string, value: string): string =>
    new Query("search", attribute, value).toString();

  static orderDesc = (attribute: string): string =>
    new Query("orderDesc", attribute).toString();

  static orderAsc = (attribute: string): string =>
    new Query("orderAsc", attribute).toString();

  static orderRandom = (): string =>
    new Query("orderRandom").toString();

  static cursorAfter = (documentId: string): string =>
    new Query("cursorAfter", undefined, documentId).toString();

  static cursorBefore = (documentId: string): string =>
    new Query("cursorBefore", undefined, documentId).toString();

  static limit = (limit: number): string =>
    new Query("limit", undefined, limit).toString();

  static offset = (offset: number): string =>
    new Query("offset", undefined, offset).toString();

  /**
   * Filter resources where attribute contains the specified value.
   *
   * @param {string} attribute
   * @param {string | string[]} value
   * @returns {string}
   */
  static contains = (attribute: string, value: string | any[]): string =>
    new Query("contains", attribute, value).toString();

  /**
   * Filter resources where attribute does not contain the specified value.
   *
   * @param {string} attribute
   * @param {string | string[]} value
   * @returns {string}
   */
  static notContains = (attribute: string, value: string | any[]): string =>
    new Query("notContains", attribute, value).toString();

  /**
   * Filter resources by searching attribute for value (inverse of search).
   * A fulltext index on attribute is required for this query to work.
   *
   * @param {string} attribute
   * @param {string} value
   * @returns {string}
   */
  static notSearch = (attribute: string, value: string): string =>
    new Query("notSearch", attribute, value).toString();

  /**
   * Filter resources where attribute is not between start and end (exclusive).
   *
   * @param {string} attribute
   * @param {string | number} start
   * @param {string | number} end
   * @returns {string}
   */
  static notBetween = (attribute: string, start: string | number, end: string | number): string =>
    new Query("notBetween", attribute, [start, end] as QueryTypesList).toString();

  /**
   * Filter resources where attribute does not start with value.
   *
   * @param {string} attribute
   * @param {string} value
   * @returns {string}
   */
  static notStartsWith = (attribute: string, value: string): string =>
    new Query("notStartsWith", attribute, value).toString();

  /**
   * Filter resources where attribute does not end with value.
   *
   * @param {string} attribute
   * @param {string} value
   * @returns {string}
   */
  static notEndsWith = (attribute: string, value: string): string =>
    new Query("notEndsWith", attribute, value).toString();

  /**
   * Filter resources where document was created before date.
   *
   * @param {string} value
   * @returns {string}
   */
  static createdBefore = (value: string): string =>
    new Query("createdBefore", undefined, value).toString();

  /**
   * Filter resources where document was created after date.
   *
   * @param {string} value
   * @returns {string}
   */
  static createdAfter = (value: string): string =>
    new Query("createdAfter", undefined, value).toString();

  /**
   * Filter resources where document was created between dates.
   *
   * @param {string} start
   * @param {string} end
   * @returns {string}
   */
  static createdBetween = (start: string, end: string): string =>
    new Query("createdBetween", undefined, [start, end] as QueryTypesList).toString();

  /**
   * Filter resources where document was updated before date.
   *
   * @param {string} value
   * @returns {string}
   */
  static updatedBefore = (value: string): string =>
    new Query("updatedBefore", undefined, value).toString();

  /**
   * Filter resources where document was updated after date.
   *
   * @param {string} value
   * @returns {string}
   */
  static updatedAfter = (value: string): string =>
    new Query("updatedAfter", undefined, value).toString();

  /**
   * Filter resources where document was updated between dates.
   *
   * @param {string} start
   * @param {string} end
   * @returns {string}
   */
  static updatedBetween = (start: string, end: string): string =>
    new Query("updatedBetween", undefined, [start, end] as QueryTypesList).toString();

  static or = (queries: string[]) =>
    new Query("or", undefined, queries.map((query) => JSON.parse(query))).toString();

  static and = (queries: string[]) =>
    new Query("and", undefined, queries.map((query) => JSON.parse(query))).toString();

  /**
   * Filter resources where attribute is at a specific distance from the given coordinates.
   *
   * @param {string} attribute
   * @param {any[]} values
   * @param {number} distance
   * @param {boolean} meters
   * @returns {string}
   */
  static distanceEqual = (attribute: string, values: any[], distance: number, meters: boolean = true): string =>
    new Query("distanceEqual", attribute, [[values, distance, meters]] as QueryTypesList).toString();

  /**
   * Filter resources where attribute is not at a specific distance from the given coordinates.
   *
   * @param {string} attribute
   * @param {any[]} values
   * @param {number} distance
   * @param {boolean} meters
   * @returns {string}
   */
  static distanceNotEqual = (attribute: string, values: any[], distance: number, meters: boolean = true): string =>
    new Query("distanceNotEqual", attribute, [[values, distance, meters]] as QueryTypesList).toString();

  /**
   * Filter resources where attribute is at a distance greater than the specified value from the given coordinates.
   *
   * @param {string} attribute
   * @param {any[]} values
   * @param {number} distance
   * @param {boolean} meters
   * @returns {string}
   */
  static distanceGreaterThan = (attribute: string, values: any[], distance: number, meters: boolean = true): string =>
    new Query("distanceGreaterThan", attribute, [[values, distance, meters]] as QueryTypesList).toString();

  /**
   * Filter resources where attribute is at a distance less than the specified value from the given coordinates.
   *
   * @param {string} attribute
   * @param {any[]} values
   * @param {number} distance
   * @param {boolean} meters
   * @returns {string}
   */
  static distanceLessThan = (attribute: string, values: any[], distance: number, meters: boolean = true): string =>
    new Query("distanceLessThan", attribute, [[values, distance, meters]] as QueryTypesList).toString();

  /**
   * Filter resources where attribute intersects with the given geometry.
   *
   * @param {string} attribute
   * @param {any[]} values
   * @returns {string}
   */
  static intersects = (attribute: string, values: any[]): string =>
    new Query("intersects", attribute, [values]).toString();

  /**
   * Filter resources where attribute does not intersect with the given geometry.
   *
   * @param {string} attribute
   * @param {any[]} values
   * @returns {string}
   */
  static notIntersects = (attribute: string, values: any[]): string =>
    new Query("notIntersects", attribute, [values]).toString();

  /**
   * Filter resources where attribute crosses the given geometry.
   *
   * @param {string} attribute
   * @param {any[]} values
   * @returns {string}
   */
  static crosses = (attribute: string, values: any[]): string =>
    new Query("crosses", attribute, [values]).toString();

  /**
   * Filter resources where attribute does not cross the given geometry.
   *
   * @param {string} attribute
   * @param {any[]} values
   * @returns {string}
   */
  static notCrosses = (attribute: string, values: any[]): string =>
    new Query("notCrosses", attribute, [values]).toString();

  /**
   * Filter resources where attribute overlaps with the given geometry.
   *
   * @param {string} attribute
   * @param {any[]} values
   * @returns {string}
   */
  static overlaps = (attribute: string, values: any[]): string =>
    new Query("overlaps", attribute, [values]).toString();

  /**
   * Filter resources where attribute does not overlap with the given geometry.
   *
   * @param {string} attribute
   * @param {any[]} values
   * @returns {string}
   */
  static notOverlaps = (attribute: string, values: any[]): string =>
    new Query("notOverlaps", attribute, [values]).toString();

  /**
   * Filter resources where attribute touches the given geometry.
   *
   * @param {string} attribute
   * @param {any[]} values
   * @returns {string}
   */
  static touches = (attribute: string, values: any[]): string =>
    new Query("touches", attribute, [values]).toString();

  /**
   * Filter resources where attribute does not touch the given geometry.
   *
   * @param {string} attribute
   * @param {any[]} values
   * @returns {string}
   */
  static notTouches = (attribute: string, values: any[]): string =>
    new Query("notTouches", attribute, [values]).toString();
}

import JSONbigModule from 'json-bigint';
const JSONbig = JSONbigModule({ useNativeBigInt: true });

type QueryTypesSingle = string | number | bigint | boolean;
export type QueryTypesList = string[] | number[] | bigint[] | boolean[] | Query[] | any[];
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
    return JSONbig.stringify({
      method: this.method,
      attribute: this.attribute,
      values: this.values,
    });
  }

  static equal = (attribute: string, value: QueryTypes): string =>
    new Query("equal", attribute, value).toString();

  static notEqual = (attribute: string, value: QueryTypes): string =>
    new Query("notEqual", attribute, value).toString();

  /**
   * Filter resources where attribute matches a regular expression pattern.
   *
   * @param {string} attribute The attribute to filter on.
   * @param {string} pattern The regular expression pattern to match.
   * @returns {string}
   */
  static regex = (attribute: string, pattern: string): string =>
    new Query("regex", attribute, pattern).toString();

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

  /**
   * Filter resources where the specified attributes exist.
   *
   * @param {string[]} attributes The list of attributes that must exist.
   * @returns {string}
   */
  static exists = (attributes: string[]): string =>
    new Query("exists", undefined, attributes).toString();

  /**
   * Filter resources where the specified attributes do not exist.
   *
   * @param {string[]} attributes The list of attributes that must not exist.
   * @returns {string}
   */
  static notExists = (attributes: string[]): string =>
    new Query("notExists", undefined, attributes).toString();

  static between = (attribute: string, start: string | number | bigint, end: string | number | bigint) =>
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
   * For string attributes, checks if the string contains the substring.
   *
   * Note: For array attributes, use {@link containsAny} or {@link containsAll} instead.
   * @param {string} attribute
   * @param {string | string[]} value
   * @returns {string}
   */
  static contains = (attribute: string, value: string | any[]): string =>
    new Query("contains", attribute, value).toString();

  /**
   * Filter resources where attribute contains ANY of the specified values.
   * For array and relationship attributes, matches documents where the attribute
   * contains at least one of the given values.
   *
   * @param {string} attribute
   * @param {any[]} value
   * @returns {string}
   */
  static containsAny = (attribute: string, value: any[]): string =>
    new Query("containsAny", attribute, value).toString();

  /**
   * Filter resources where attribute contains ALL of the specified values.
   * For array and relationship attributes, matches documents where the attribute
   * contains every one of the given values.
   *
   * @param {string} attribute
   * @param {any[]} value
   * @returns {string}
   */
  static containsAll = (attribute: string, value: any[]): string =>
    new Query("containsAll", attribute, value).toString();

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
   * @param {string | number | bigint} start
   * @param {string | number | bigint} end
   * @returns {string}
   */
  static notBetween = (attribute: string, start: string | number | bigint, end: string | number | bigint): string =>
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
    Query.lessThan("$createdAt", value);

  /**
   * Filter resources where document was created after date.
   *
   * @param {string} value
   * @returns {string}
   */
  static createdAfter = (value: string): string =>
    Query.greaterThan("$createdAt", value);

  /**
   * Filter resources where document was created between dates.
   *
   * @param {string} start
   * @param {string} end
   * @returns {string}
   */
  static createdBetween = (start: string, end: string): string =>
    Query.between("$createdAt", start, end);

  /**
   * Filter resources where document was updated before date.
   *
   * @param {string} value
   * @returns {string}
   */
  static updatedBefore = (value: string): string =>
    Query.lessThan("$updatedAt", value);

  /**
   * Filter resources where document was updated after date.
   *
   * @param {string} value
   * @returns {string}
   */
  static updatedAfter = (value: string): string =>
    Query.greaterThan("$updatedAt", value);

  /**
   * Filter resources where document was updated between dates.
   *
   * @param {string} start
   * @param {string} end
   * @returns {string}
   */
  static updatedBetween = (start: string, end: string): string =>
    Query.between("$updatedAt", start, end);

  static or = (queries: string[]) =>
    new Query("or", undefined, queries.map((query) => JSONbig.parse(query))).toString();

  static and = (queries: string[]) =>
    new Query("and", undefined, queries.map((query) => JSONbig.parse(query))).toString();

  /**
   * Filter array elements where at least one element matches all the specified queries.
   *
   * @param {string} attribute The attribute containing the array to filter on.
   * @param {string[]} queries The list of query strings to match against array elements.
   * @returns {string}
   */
  static elemMatch = (attribute: string, queries: string[]): string =>
    new Query(
      "elemMatch",
      attribute,
      queries.map((query) => JSONbig.parse(query))
    ).toString();

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

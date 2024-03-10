type QueryTypesSingle = string | number | boolean;
export type QueryTypesList = string[] | number[] | boolean[] | Query[];
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

  static cursorAfter = (documentId: string): string =>
    new Query("cursorAfter", undefined, documentId).toString();

  static cursorBefore = (documentId: string): string =>
    new Query("cursorBefore", undefined, documentId).toString();

  static limit = (limit: number): string =>
    new Query("limit", undefined, limit).toString();

  static offset = (offset: number): string =>
    new Query("offset", undefined, offset).toString();

  static contains = (attribute: string, value: string | string[]): string =>
    new Query("contains", attribute, value).toString();

  static or = (queries: string[]) =>
    new Query("or", undefined, queries.map((query) => JSON.parse(query))).toString();

  static and = (queries: string[]) =>
    new Query("and", undefined, queries.map((query) => JSON.parse(query))).toString();
}

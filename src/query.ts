import JSONbigModule from 'json-bigint';
const JSONbig = JSONbigModule({ useNativeBigInt: true });

type QueryTypesSingle = string | number | bigint | boolean;
export type QueryTypesList =
    string[] | number[] | bigint[] | boolean[] | Query[] | any[];
export type QueryTypes = QueryTypesSingle | QueryTypesList;
type AttributesTypes = string | string[];

export class Query {
    method: string;
    attribute: AttributesTypes | undefined;
    values: QueryTypesList | undefined;

    constructor(
        method: string,
        attribute?: AttributesTypes,
        values?: QueryTypes,
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
        new Query('equal', attribute, value).toString();

    static notEqual = (attribute: string, value: QueryTypes): string =>
        new Query('notEqual', attribute, value).toString();

    /**
     * Filter resources where attribute matches a regular expression pattern.
     *
     * @param {string} attribute The attribute to filter on.
     * @param {string} pattern The regular expression pattern to match.
     * @returns {string}
     */
    static regex = (attribute: string, pattern: string): string =>
        new Query('regex', attribute, pattern).toString();

    static lessThan = (attribute: string, value: QueryTypes): string =>
        new Query('lessThan', attribute, value).toString();

    static lessThanEqual = (attribute: string, value: QueryTypes): string =>
        new Query('lessThanEqual', attribute, value).toString();

    static greaterThan = (attribute: string, value: QueryTypes): string =>
        new Query('greaterThan', attribute, value).toString();

    static greaterThanEqual = (attribute: string, value: QueryTypes): string =>
        new Query('greaterThanEqual', attribute, value).toString();

    static isNull = (attribute: string): string =>
        new Query('isNull', attribute).toString();

    static isNotNull = (attribute: string): string =>
        new Query('isNotNull', attribute).toString();

    /**
     * Filter resources where the specified attributes exist.
     *
     * @param {string[]} attributes The list of attributes that must exist.
     * @returns {string}
     */
    static exists = (attributes: string[]): string =>
        new Query('exists', undefined, attributes).toString();

    /**
     * Filter resources where the specified attributes do not exist.
     *
     * @param {string[]} attributes The list of attributes that must not exist.
     * @returns {string}
     */
    static notExists = (attributes: string[]): string =>
        new Query('notExists', undefined, attributes).toString();

    static between = (
        attribute: string,
        start: string | number | bigint,
        end: string | number | bigint,
    ) =>
        new Query('between', attribute, [
            start,
            end,
        ] as QueryTypesList).toString();

    static startsWith = (attribute: string, value: string): string =>
        new Query('startsWith', attribute, value).toString();

    static endsWith = (attribute: string, value: string): string =>
        new Query('endsWith', attribute, value).toString();

    static select = (attributes: string[]): string =>
        new Query('select', undefined, attributes).toString();

    static search = (attribute: string, value: string): string =>
        new Query('search', attribute, value).toString();

    static orderDesc = (attribute: string): string =>
        new Query('orderDesc', attribute).toString();

    static orderAsc = (attribute: string): string =>
        new Query('orderAsc', attribute).toString();

    static orderRandom = (): string => new Query('orderRandom').toString();

    static cursorAfter = (documentId: string): string =>
        new Query('cursorAfter', undefined, documentId).toString();

    static cursorBefore = (documentId: string): string =>
        new Query('cursorBefore', undefined, documentId).toString();

    static limit = (limit: number): string =>
        new Query('limit', undefined, limit).toString();

    static offset = (offset: number): string =>
        new Query('offset', undefined, offset).toString();

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
        new Query('contains', attribute, value).toString();

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
        new Query('containsAny', attribute, value).toString();

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
        new Query('containsAll', attribute, value).toString();

    /**
     * Filter resources where attribute does not contain the specified value.
     *
     * @param {string} attribute
     * @param {string | string[]} value
     * @returns {string}
     */
    static notContains = (attribute: string, value: string | any[]): string =>
        new Query('notContains', attribute, value).toString();

    /**
     * Filter resources by searching attribute for value (inverse of search).
     * A fulltext index on attribute is required for this query to work.
     *
     * @param {string} attribute
     * @param {string} value
     * @returns {string}
     */
    static notSearch = (attribute: string, value: string): string =>
        new Query('notSearch', attribute, value).toString();

    /**
     * Filter resources where attribute is not between start and end (exclusive).
     *
     * @param {string} attribute
     * @param {string | number | bigint} start
     * @param {string | number | bigint} end
     * @returns {string}
     */
    static notBetween = (
        attribute: string,
        start: string | number | bigint,
        end: string | number | bigint,
    ): string =>
        new Query('notBetween', attribute, [
            start,
            end,
        ] as QueryTypesList).toString();

    /**
     * Filter resources where attribute does not start with value.
     *
     * @param {string} attribute
     * @param {string} value
     * @returns {string}
     */
    static notStartsWith = (attribute: string, value: string): string =>
        new Query('notStartsWith', attribute, value).toString();

    /**
     * Filter resources where attribute does not end with value.
     *
     * @param {string} attribute
     * @param {string} value
     * @returns {string}
     */
    static notEndsWith = (attribute: string, value: string): string =>
        new Query('notEndsWith', attribute, value).toString();

    /**
     * Filter resources where document was created before date.
     *
     * @param {string} value
     * @returns {string}
     */
    static createdBefore = (value: string): string =>
        Query.lessThan('$createdAt', value);

    /**
     * Filter resources where document was created after date.
     *
     * @param {string} value
     * @returns {string}
     */
    static createdAfter = (value: string): string =>
        Query.greaterThan('$createdAt', value);

    /**
     * Filter resources where document was created between dates.
     *
     * @param {string} start
     * @param {string} end
     * @returns {string}
     */
    static createdBetween = (start: string, end: string): string =>
        Query.between('$createdAt', start, end);

    /**
     * Filter resources where document was updated before date.
     *
     * @param {string} value
     * @returns {string}
     */
    static updatedBefore = (value: string): string =>
        Query.lessThan('$updatedAt', value);

    /**
     * Filter resources where document was updated after date.
     *
     * @param {string} value
     * @returns {string}
     */
    static updatedAfter = (value: string): string =>
        Query.greaterThan('$updatedAt', value);

    /**
     * Filter resources where document was updated between dates.
     *
     * @param {string} start
     * @param {string} end
     * @returns {string}
     */
    static updatedBetween = (start: string, end: string): string =>
        Query.between('$updatedAt', start, end);

    static or = (queries: string[]) =>
        new Query(
            'or',
            undefined,
            queries.map((query) => JSONbig.parse(query)),
        ).toString();

    static and = (queries: string[]) =>
        new Query(
            'and',
            undefined,
            queries.map((query) => JSONbig.parse(query)),
        ).toString();

    /**
     * Filter array elements where at least one element matches all the specified queries.
     *
     * @param {string} attribute The attribute containing the array to filter on.
     * @param {string[]} queries The list of query strings to match against array elements.
     * @returns {string}
     */
    static elemMatch = (attribute: string, queries: string[]): string =>
        new Query(
            'elemMatch',
            attribute,
            queries.map((query) => JSONbig.parse(query)),
        ).toString();

    /**
     * Constrain populated related documents on a relationship attribute.
     *
     * @param {string} attribute The relationship attribute to query.
     * @param {string[]} queries Filter, order, select, and pagination queries applied to related documents.
     * @returns {string}
     */
    static relationship = (attribute: string, queries: string[]): string =>
        new Query(
            'relationship',
            attribute,
            queries.map((query) => JSONbig.parse(query)),
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
    static distanceEqual = (
        attribute: string,
        values: any[],
        distance: number,
        meters: boolean = true,
    ): string =>
        new Query('distanceEqual', attribute, [
            [values, distance, meters],
        ] as QueryTypesList).toString();

    /**
     * Filter resources where attribute is not at a specific distance from the given coordinates.
     *
     * @param {string} attribute
     * @param {any[]} values
     * @param {number} distance
     * @param {boolean} meters
     * @returns {string}
     */
    static distanceNotEqual = (
        attribute: string,
        values: any[],
        distance: number,
        meters: boolean = true,
    ): string =>
        new Query('distanceNotEqual', attribute, [
            [values, distance, meters],
        ] as QueryTypesList).toString();

    /**
     * Filter resources where attribute is at a distance greater than the specified value from the given coordinates.
     *
     * @param {string} attribute
     * @param {any[]} values
     * @param {number} distance
     * @param {boolean} meters
     * @returns {string}
     */
    static distanceGreaterThan = (
        attribute: string,
        values: any[],
        distance: number,
        meters: boolean = true,
    ): string =>
        new Query('distanceGreaterThan', attribute, [
            [values, distance, meters],
        ] as QueryTypesList).toString();

    /**
     * Filter resources where attribute is at a distance less than the specified value from the given coordinates.
     *
     * @param {string} attribute
     * @param {any[]} values
     * @param {number} distance
     * @param {boolean} meters
     * @returns {string}
     */
    static distanceLessThan = (
        attribute: string,
        values: any[],
        distance: number,
        meters: boolean = true,
    ): string =>
        new Query('distanceLessThan', attribute, [
            [values, distance, meters],
        ] as QueryTypesList).toString();

    /**
     * Filter resources using vector dot product similarity.
     *
     * @param {string} attribute
     * @param {number[]} vector
     * @returns {string}
     */
    static vectorDot = (attribute: string, vector: number[]): string =>
        new Query('vectorDot', attribute, [
            vector,
        ] as QueryTypesList).toString();

    /**
     * Filter resources using vector cosine similarity.
     *
     * @param {string} attribute
     * @param {number[]} vector
     * @returns {string}
     */
    static vectorCosine = (attribute: string, vector: number[]): string =>
        new Query('vectorCosine', attribute, [
            vector,
        ] as QueryTypesList).toString();

    /**
     * Filter resources using vector Euclidean distance.
     *
     * @param {string} attribute
     * @param {number[]} vector
     * @returns {string}
     */
    static vectorEuclidean = (attribute: string, vector: number[]): string =>
        new Query('vectorEuclidean', attribute, [
            vector,
        ] as QueryTypesList).toString();

    /**
     * Filter resources where attribute intersects with the given geometry.
     *
     * @param {string} attribute
     * @param {any[]} values
     * @returns {string}
     */
    static intersects = (attribute: string, values: any[]): string =>
        new Query('intersects', attribute, [values]).toString();

    /**
     * Filter resources where attribute does not intersect with the given geometry.
     *
     * @param {string} attribute
     * @param {any[]} values
     * @returns {string}
     */
    static notIntersects = (attribute: string, values: any[]): string =>
        new Query('notIntersects', attribute, [values]).toString();

    /**
     * Filter resources where attribute crosses the given geometry.
     *
     * @param {string} attribute
     * @param {any[]} values
     * @returns {string}
     */
    static crosses = (attribute: string, values: any[]): string =>
        new Query('crosses', attribute, [values]).toString();

    /**
     * Filter resources where attribute does not cross the given geometry.
     *
     * @param {string} attribute
     * @param {any[]} values
     * @returns {string}
     */
    static notCrosses = (attribute: string, values: any[]): string =>
        new Query('notCrosses', attribute, [values]).toString();

    /**
     * Filter resources where attribute overlaps with the given geometry.
     *
     * @param {string} attribute
     * @param {any[]} values
     * @returns {string}
     */
    static overlaps = (attribute: string, values: any[]): string =>
        new Query('overlaps', attribute, [values]).toString();

    /**
     * Filter resources where attribute does not overlap with the given geometry.
     *
     * @param {string} attribute
     * @param {any[]} values
     * @returns {string}
     */
    static notOverlaps = (attribute: string, values: any[]): string =>
        new Query('notOverlaps', attribute, [values]).toString();

    /**
     * Filter resources where attribute touches the given geometry.
     *
     * @param {string} attribute
     * @param {any[]} values
     * @returns {string}
     */
    static touches = (attribute: string, values: any[]): string =>
        new Query('touches', attribute, [values]).toString();

    /**
     * Filter resources where attribute does not touch the given geometry.
     *
     * @param {string} attribute
     * @param {any[]} values
     * @returns {string}
     */
    static notTouches = (attribute: string, values: any[]): string =>
        new Query('notTouches', attribute, [values]).toString();

    /**
     * Count documents, optionally aliased.
     */
    static count = (attribute: string = '*', alias: string = ''): string =>
        new Query(
            'count',
            attribute,
            alias !== '' ? alias : undefined,
        ).toString();

    /**
     * Count distinct values of attribute, optionally aliased.
     */
    static countDistinct = (attribute: string, alias: string = ''): string =>
        new Query(
            'countDistinct',
            attribute,
            alias !== '' ? alias : undefined,
        ).toString();

    static sum = (attribute: string, alias: string = ''): string =>
        new Query(
            'sum',
            attribute,
            alias !== '' ? alias : undefined,
        ).toString();

    static avg = (attribute: string, alias: string = ''): string =>
        new Query(
            'avg',
            attribute,
            alias !== '' ? alias : undefined,
        ).toString();

    static min = (attribute: string, alias: string = ''): string =>
        new Query(
            'min',
            attribute,
            alias !== '' ? alias : undefined,
        ).toString();

    static max = (attribute: string, alias: string = ''): string =>
        new Query(
            'max',
            attribute,
            alias !== '' ? alias : undefined,
        ).toString();

    static stddev = (attribute: string, alias: string = ''): string =>
        new Query(
            'stddev',
            attribute,
            alias !== '' ? alias : undefined,
        ).toString();

    static stddevPop = (attribute: string, alias: string = ''): string =>
        new Query(
            'stddevPop',
            attribute,
            alias !== '' ? alias : undefined,
        ).toString();

    static stddevSamp = (attribute: string, alias: string = ''): string =>
        new Query(
            'stddevSamp',
            attribute,
            alias !== '' ? alias : undefined,
        ).toString();

    static variance = (attribute: string, alias: string = ''): string =>
        new Query(
            'variance',
            attribute,
            alias !== '' ? alias : undefined,
        ).toString();

    static varPop = (attribute: string, alias: string = ''): string =>
        new Query(
            'varPop',
            attribute,
            alias !== '' ? alias : undefined,
        ).toString();

    static varSamp = (attribute: string, alias: string = ''): string =>
        new Query(
            'varSamp',
            attribute,
            alias !== '' ? alias : undefined,
        ).toString();

    static bitAnd = (attribute: string, alias: string = ''): string =>
        new Query(
            'bitAnd',
            attribute,
            alias !== '' ? alias : undefined,
        ).toString();

    static bitOr = (attribute: string, alias: string = ''): string =>
        new Query(
            'bitOr',
            attribute,
            alias !== '' ? alias : undefined,
        ).toString();

    static bitXor = (attribute: string, alias: string = ''): string =>
        new Query(
            'bitXor',
            attribute,
            alias !== '' ? alias : undefined,
        ).toString();

    /**
     * Group results by attributes.
     */
    static groupBy = (attributes: string[]): string =>
        new Query('groupBy', undefined, attributes).toString();

    /**
     * Filter grouped results. `queries` are nested like `and`/`or`.
     */
    static having = (queries: string[]): string =>
        new Query(
            'having',
            undefined,
            queries.map((query) => JSONbig.parse(query)),
        ).toString();

    static distinct = (): string => new Query('distinct').toString();

    /**
     * Column-to-column join ON condition.
     */
    static on = (left: string, right: string, operator: string = '='): string =>
        new Query('on', undefined, [left, operator, right]).toString();

    /**
     * Inner join. `table` is the joined collection/table ID.
     */
    static join = (
        table: string,
        leftOrAliasOrOn: string | string[],
        rightOrOn: string | string[] = '',
        operator: string = '=',
        alias: string = '',
    ): string =>
        Query.createJoin(
            'join',
            table,
            leftOrAliasOrOn,
            rightOrOn,
            operator,
            alias,
        );

    static leftJoin = (
        table: string,
        leftOrAliasOrOn: string | string[],
        rightOrOn: string | string[] = '',
        operator: string = '=',
        alias: string = '',
    ): string =>
        Query.createJoin(
            'leftJoin',
            table,
            leftOrAliasOrOn,
            rightOrOn,
            operator,
            alias,
        );

    static rightJoin = (
        table: string,
        leftOrAliasOrOn: string | string[],
        rightOrOn: string | string[] = '',
        operator: string = '=',
        alias: string = '',
    ): string =>
        Query.createJoin(
            'rightJoin',
            table,
            leftOrAliasOrOn,
            rightOrOn,
            operator,
            alias,
        );

    static fullOuterJoin = (
        table: string,
        leftOrAliasOrOn: string | string[],
        rightOrOn: string | string[] = '',
        operator: string = '=',
        alias: string = '',
    ): string =>
        Query.createJoin(
            'fullOuterJoin',
            table,
            leftOrAliasOrOn,
            rightOrOn,
            operator,
            alias,
        );

    static crossJoin = (table: string, alias: string = ''): string =>
        new Query(
            'crossJoin',
            table,
            alias !== '' ? alias : undefined,
        ).toString();

    static covers = (attribute: string, values: any[]): string =>
        new Query('covers', attribute, [values]).toString();

    static notCovers = (attribute: string, values: any[]): string =>
        new Query('notCovers', attribute, [values]).toString();

    static spatialEquals = (attribute: string, values: any[]): string =>
        new Query('spatialEquals', attribute, [values]).toString();

    static notSpatialEquals = (attribute: string, values: any[]): string =>
        new Query('notSpatialEquals', attribute, [values]).toString();

    /**
     * Return limit and offset queries for 1-based page pagination.
     */
    static page = (page: number, perPage: number = 25): string[] => {
        if (page < 1) {
            throw new Error('Page must be >= 1, got ' + page);
        }
        if (perPage < 1) {
            throw new Error('Per page must be >= 1, got ' + perPage);
        }
        return [Query.limit(perPage), Query.offset((page - 1) * perPage)];
    };

    static builder = (): Query.Builder => new Query.Builder();

    private static createJoin(
        method: string,
        table: string,
        leftOrAliasOrOn: string | string[],
        rightOrOn: string | string[] = '',
        operator: string = '=',
        alias: string = '',
    ): string {
        if (Array.isArray(leftOrAliasOrOn)) {
            return Query.nestedJoin(method, table, '', leftOrAliasOrOn);
        }
        if (Array.isArray(rightOrOn)) {
            return Query.nestedJoin(method, table, leftOrAliasOrOn, rightOrOn);
        }
        return new Query(
            method,
            table,
            alias !== ''
                ? [leftOrAliasOrOn, operator, rightOrOn, alias]
                : [leftOrAliasOrOn, operator, rightOrOn],
        ).toString();
    }

    private static nestedJoin(
        method: string,
        table: string,
        alias: string,
        on: string[],
    ): string {
        const values: any[] = [];
        if (alias !== '') {
            values.push(alias);
        }
        for (const query of on) {
            values.push(JSONbig.parse(query));
        }
        return new Query(method, table, values).toString();
    }
}

export type QueryInput = string | Query | Query.Builder | QueryInput[];

/**
 * Fluent collector of Query fragments. Call {@link Query.Builder.build} to
 * produce the `string[]` expected by list/createQuery methods.
 */
export namespace Query {
    export class Builder {
        private readonly queries: string[] = [];

        build(): string[] {
            return [...this.queries];
        }

        equal(attribute: string, value: QueryTypes): this {
            return this.push(Query.equal(attribute, value));
        }

        notEqual(attribute: string, value: QueryTypes): this {
            return this.push(Query.notEqual(attribute, value));
        }

        lessThan(attribute: string, value: QueryTypes): this {
            return this.push(Query.lessThan(attribute, value));
        }

        lessThanEqual(attribute: string, value: QueryTypes): this {
            return this.push(Query.lessThanEqual(attribute, value));
        }

        greaterThan(attribute: string, value: QueryTypes): this {
            return this.push(Query.greaterThan(attribute, value));
        }

        greaterThanEqual(attribute: string, value: QueryTypes): this {
            return this.push(Query.greaterThanEqual(attribute, value));
        }

        search(attribute: string, value: string): this {
            return this.push(Query.search(attribute, value));
        }

        isNull(attribute: string): this {
            return this.push(Query.isNull(attribute));
        }

        isNotNull(attribute: string): this {
            return this.push(Query.isNotNull(attribute));
        }

        between(
            attribute: string,
            start: string | number | bigint,
            end: string | number | bigint,
        ): this {
            return this.push(Query.between(attribute, start, end));
        }

        startsWith(attribute: string, value: string): this {
            return this.push(Query.startsWith(attribute, value));
        }

        endsWith(attribute: string, value: string): this {
            return this.push(Query.endsWith(attribute, value));
        }

        select(attributes: string[]): this {
            return this.push(Query.select(attributes));
        }

        cursorAfter(documentId: string): this {
            return this.push(Query.cursorAfter(documentId));
        }

        cursorBefore(documentId: string): this {
            return this.push(Query.cursorBefore(documentId));
        }

        orderAsc(attribute: string): this {
            return this.push(Query.orderAsc(attribute));
        }

        orderDesc(attribute: string): this {
            return this.push(Query.orderDesc(attribute));
        }

        orderRandom(): this {
            return this.push(Query.orderRandom());
        }

        limit(limit: number): this {
            return this.push(Query.limit(limit));
        }

        offset(offset: number): this {
            return this.push(Query.offset(offset));
        }

        contains(attribute: string, value: string | any[]): this {
            return this.push(Query.contains(attribute, value));
        }

        containsAny(attribute: string, value: any[]): this {
            return this.push(Query.containsAny(attribute, value));
        }

        containsAll(attribute: string, value: any[]): this {
            return this.push(Query.containsAll(attribute, value));
        }

        notContains(attribute: string, value: string | any[]): this {
            return this.push(Query.notContains(attribute, value));
        }

        notSearch(attribute: string, value: string): this {
            return this.push(Query.notSearch(attribute, value));
        }

        notBetween(
            attribute: string,
            start: string | number | bigint,
            end: string | number | bigint,
        ): this {
            return this.push(Query.notBetween(attribute, start, end));
        }

        notStartsWith(attribute: string, value: string): this {
            return this.push(Query.notStartsWith(attribute, value));
        }

        notEndsWith(attribute: string, value: string): this {
            return this.push(Query.notEndsWith(attribute, value));
        }

        regex(attribute: string, pattern: string): this {
            return this.push(Query.regex(attribute, pattern));
        }

        exists(attributes: string[]): this {
            return this.push(Query.exists(attributes));
        }

        notExists(attributes: string[]): this {
            return this.push(Query.notExists(attributes));
        }

        createdBefore(value: string): this {
            return this.push(Query.createdBefore(value));
        }

        createdAfter(value: string): this {
            return this.push(Query.createdAfter(value));
        }

        createdBetween(start: string, end: string): this {
            return this.push(Query.createdBetween(start, end));
        }

        updatedBefore(value: string): this {
            return this.push(Query.updatedBefore(value));
        }

        updatedAfter(value: string): this {
            return this.push(Query.updatedAfter(value));
        }

        updatedBetween(start: string, end: string): this {
            return this.push(Query.updatedBetween(start, end));
        }

        or(queries: string[]): this {
            return this.push(Query.or(queries));
        }

        and(queries: string[]): this {
            return this.push(Query.and(queries));
        }

        elemMatch(attribute: string, queries: string[]): this {
            return this.push(Query.elemMatch(attribute, queries));
        }

        relationship(attribute: string, queries: string[]): this {
            return this.push(Query.relationship(attribute, queries));
        }

        distanceEqual(
            attribute: string,
            values: any[],
            distance: number,
            meters: boolean = true,
        ): this {
            return this.push(
                Query.distanceEqual(attribute, values, distance, meters),
            );
        }

        distanceNotEqual(
            attribute: string,
            values: any[],
            distance: number,
            meters: boolean = true,
        ): this {
            return this.push(
                Query.distanceNotEqual(attribute, values, distance, meters),
            );
        }

        distanceGreaterThan(
            attribute: string,
            values: any[],
            distance: number,
            meters: boolean = true,
        ): this {
            return this.push(
                Query.distanceGreaterThan(attribute, values, distance, meters),
            );
        }

        distanceLessThan(
            attribute: string,
            values: any[],
            distance: number,
            meters: boolean = true,
        ): this {
            return this.push(
                Query.distanceLessThan(attribute, values, distance, meters),
            );
        }

        intersects(attribute: string, values: any[]): this {
            return this.push(Query.intersects(attribute, values));
        }

        notIntersects(attribute: string, values: any[]): this {
            return this.push(Query.notIntersects(attribute, values));
        }

        crosses(attribute: string, values: any[]): this {
            return this.push(Query.crosses(attribute, values));
        }

        notCrosses(attribute: string, values: any[]): this {
            return this.push(Query.notCrosses(attribute, values));
        }

        overlaps(attribute: string, values: any[]): this {
            return this.push(Query.overlaps(attribute, values));
        }

        notOverlaps(attribute: string, values: any[]): this {
            return this.push(Query.notOverlaps(attribute, values));
        }

        touches(attribute: string, values: any[]): this {
            return this.push(Query.touches(attribute, values));
        }

        notTouches(attribute: string, values: any[]): this {
            return this.push(Query.notTouches(attribute, values));
        }

        count(attribute: string = '*', alias: string = ''): this {
            return this.push(Query.count(attribute, alias));
        }

        countDistinct(attribute: string, alias: string = ''): this {
            return this.push(Query.countDistinct(attribute, alias));
        }

        sum(attribute: string, alias: string = ''): this {
            return this.push(Query.sum(attribute, alias));
        }

        avg(attribute: string, alias: string = ''): this {
            return this.push(Query.avg(attribute, alias));
        }

        min(attribute: string, alias: string = ''): this {
            return this.push(Query.min(attribute, alias));
        }

        max(attribute: string, alias: string = ''): this {
            return this.push(Query.max(attribute, alias));
        }

        stddev(attribute: string, alias: string = ''): this {
            return this.push(Query.stddev(attribute, alias));
        }

        stddevPop(attribute: string, alias: string = ''): this {
            return this.push(Query.stddevPop(attribute, alias));
        }

        stddevSamp(attribute: string, alias: string = ''): this {
            return this.push(Query.stddevSamp(attribute, alias));
        }

        variance(attribute: string, alias: string = ''): this {
            return this.push(Query.variance(attribute, alias));
        }

        varPop(attribute: string, alias: string = ''): this {
            return this.push(Query.varPop(attribute, alias));
        }

        varSamp(attribute: string, alias: string = ''): this {
            return this.push(Query.varSamp(attribute, alias));
        }

        bitAnd(attribute: string, alias: string = ''): this {
            return this.push(Query.bitAnd(attribute, alias));
        }

        bitOr(attribute: string, alias: string = ''): this {
            return this.push(Query.bitOr(attribute, alias));
        }

        bitXor(attribute: string, alias: string = ''): this {
            return this.push(Query.bitXor(attribute, alias));
        }

        groupBy(attributes: string[]): this {
            return this.push(Query.groupBy(attributes));
        }

        having(queries: string[]): this {
            return this.push(Query.having(queries));
        }

        distinct(): this {
            return this.push(Query.distinct());
        }

        join(
            table: string,
            leftOrAliasOrOn: string | string[],
            rightOrOn: string | string[] = '',
            operator: string = '=',
            alias: string = '',
        ): this {
            return this.push(
                Query.join(table, leftOrAliasOrOn, rightOrOn, operator, alias),
            );
        }

        leftJoin(
            table: string,
            leftOrAliasOrOn: string | string[],
            rightOrOn: string | string[] = '',
            operator: string = '=',
            alias: string = '',
        ): this {
            return this.push(
                Query.leftJoin(
                    table,
                    leftOrAliasOrOn,
                    rightOrOn,
                    operator,
                    alias,
                ),
            );
        }

        rightJoin(
            table: string,
            leftOrAliasOrOn: string | string[],
            rightOrOn: string | string[] = '',
            operator: string = '=',
            alias: string = '',
        ): this {
            return this.push(
                Query.rightJoin(
                    table,
                    leftOrAliasOrOn,
                    rightOrOn,
                    operator,
                    alias,
                ),
            );
        }

        fullOuterJoin(
            table: string,
            leftOrAliasOrOn: string | string[],
            rightOrOn: string | string[] = '',
            operator: string = '=',
            alias: string = '',
        ): this {
            return this.push(
                Query.fullOuterJoin(
                    table,
                    leftOrAliasOrOn,
                    rightOrOn,
                    operator,
                    alias,
                ),
            );
        }

        crossJoin(table: string, alias: string = ''): this {
            return this.push(Query.crossJoin(table, alias));
        }

        vectorDot(attribute: string, vector: number[]): this {
            return this.push(Query.vectorDot(attribute, vector));
        }

        vectorCosine(attribute: string, vector: number[]): this {
            return this.push(Query.vectorCosine(attribute, vector));
        }

        vectorEuclidean(attribute: string, vector: number[]): this {
            return this.push(Query.vectorEuclidean(attribute, vector));
        }

        covers(attribute: string, values: any[]): this {
            return this.push(Query.covers(attribute, values));
        }

        notCovers(attribute: string, values: any[]): this {
            return this.push(Query.notCovers(attribute, values));
        }

        spatialEquals(attribute: string, values: any[]): this {
            return this.push(Query.spatialEquals(attribute, values));
        }

        notSpatialEquals(attribute: string, values: any[]): this {
            return this.push(Query.notSpatialEquals(attribute, values));
        }

        page(page: number, perPage: number = 25): this {
            return this.push(Query.page(page, perPage));
        }

        private push(query: string | string[]): this {
            if (Array.isArray(query)) {
                this.queries.push(...query);
            } else {
                this.queries.push(query);
            }
            return this;
        }
    }
}

export function normalizeQueries(queries?: QueryInput | null): string[] {
    if (queries == null) {
        return [];
    }
    if (queries instanceof Query.Builder) {
        return queries.build();
    }
    if (!Array.isArray(queries)) {
        if (queries instanceof Query) {
            return [queries.toString()];
        }
        if (typeof queries === 'string') {
            return [queries];
        }
        return [];
    }

    const out: string[] = [];
    for (const item of queries) {
        out.push(...normalizeQueries(item));
    }
    return out;
}

function isQueryValue(value: unknown): value is Query | Query.Builder {
    return value instanceof Query.Builder || value instanceof Query;
}

export function flattenParam(value: unknown): unknown {
    if (isQueryValue(value)) {
        return normalizeQueries(value);
    }
    if (!Array.isArray(value) || !value.some(isQueryValue)) {
        return value;
    }

    const out: unknown[] = [];
    for (const item of value) {
        if (isQueryValue(item)) {
            out.push(...normalizeQueries(item));
        } else {
            out.push(item);
        }
    }
    return out;
}

export const QueryBuilder = Query.Builder;
export type QueryBuilder = Query.Builder;

interface Root {}
interface Database { _db: any }
interface Collection { _coll: any }
interface Document { _doc: any }
interface TablesDB { _tdb: any }
interface Table { _tbl: any }
interface Row { _row: any }
interface Bucket { _bkt: any }
interface File { _file: any }
interface Func { _fn: any }
interface Execution { _exec: any }
interface Team { _team: any }
interface Membership { _mem: any }
interface Resolved { _res: any }

type Actionable = Document | Row | File | Team | Membership;

function normalize(id: string): string {
  if (id === undefined || id === null) {
    throw new Error("Channel ID is required");
  }
  const trimmed = String(id).trim();
  if (trimmed === "") {
    throw new Error("Channel ID is required");
  }
  return trimmed;
}

export class Channel<T> {
  declare _type: T;

  private constructor(private readonly segments: string[]) {}

  private next<N>(segment: string, id?: string): Channel<N> {
    const segments =
      id === undefined
        ? [...this.segments, segment]
        : [...this.segments, segment, normalize(id)];

    return new Channel<N>(segments) as any;
  }

  private resolve(action: string): Channel<Resolved> {
    return new Channel<Resolved>([...this.segments, action]) as any;
  }

  toString(): string {
    return this.segments.join(".");
  }

  // --- DATABASE ROUTE ---
  // Only available on Channel<Database>
  collection(this: Channel<Database>, id: string): Channel<Collection> {
    return this.next<Collection>("collections", id);
  }

  // Only available on Channel<Collection>
  document(this: Channel<Collection>, id?: string): Channel<Document> {
    return this.next<Document>("documents", id);
  }

  // --- TABLESDB ROUTE ---
  table(this: Channel<TablesDB>, id: string): Channel<Table> {
    return this.next<Table>("tables", id);
  }

  row(this: Channel<Table>, id?: string): Channel<Row> {
    return this.next<Row>("rows", id);
  }

  // --- BUCKET ROUTE ---
  file(this: Channel<Bucket>, id?: string): Channel<File> {
    return this.next<File>("files", id);
  }

  // --- TERMINAL ACTIONS ---
  // Restricted to the Actionable union
  create(this: Channel<Actionable>): Channel<Resolved> {
    return this.resolve("create");
  }

  upsert(this: Channel<Document | Row>): Channel<Resolved> {
    return this.resolve("upsert");
  }

  update(this: Channel<Actionable>): Channel<Resolved> {
    return this.resolve("update");
  }

  delete(this: Channel<Actionable>): Channel<Resolved> {
    return this.resolve("delete");
  }

  // --- ROOT FACTORIES ---
  static database(id: string) {
    return new Channel<Database>(["databases", normalize(id)]);
  }

  static tablesdb(id: string) {
    return new Channel<TablesDB>(["tablesdb", normalize(id)]);
  }

  static bucket(id: string) {
    return new Channel<Bucket>(["buckets", normalize(id)]);
  }

  static function(id: string) {
    return new Channel<Func>(["functions", normalize(id)]);
  }

  static execution(id: string) {
    return new Channel<Execution>(["executions", normalize(id)]);
  }

  static team(id: string) {
    return new Channel<Team>(["teams", normalize(id)]);
  }

  static membership(id: string) {
    return new Channel<Membership>(["memberships", normalize(id)]);
  }

  static account(): string {
    return "account";
  }

  // Global events
  static documents(): string {
    return "documents";
  }

  static rows(): string {
    return "rows";
  }

  static files(): string {
    return "files";
  }

  static executions(): string {
    return "executions";
  }

  static teams(): string {
    return "teams";
  }

  static memberships(): string {
    return "memberships";
  }
}

// Export types for backward compatibility with realtime
export type ActionableChannel = Channel<Document> | Channel<Row> | Channel<File> | Channel<Execution> | Channel<Team> | Channel<Membership>;
export type ResolvedChannel = Channel<Resolved>;

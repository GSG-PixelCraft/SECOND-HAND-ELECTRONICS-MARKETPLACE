type Response = (value: unknown) => unknown;
type Context = {
  json: (value: unknown) => unknown;
};
type Resolver = (req: unknown, res: Response, ctx: Context) => unknown;

type Handler = {
  method: string;
  path: string;
  resolver: Resolver;
};

const createHandler =
  (method: string) =>
  (path: string, resolver: Resolver): Handler => ({
    method,
    path,
    resolver,
  });

export const rest = {
  get: createHandler("GET"),
  post: createHandler("POST"),
};

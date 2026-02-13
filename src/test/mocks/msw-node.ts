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

export const setupServer = (...handlers: Handler[]) => {
  void handlers;
  return {
    listen: () => {},
    resetHandlers: () => {},
    close: () => {},
  };
};

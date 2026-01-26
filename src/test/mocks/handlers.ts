// // MSW request handlers
// import { rest } from "msw";
// import { API_ENDPOINTS } from "@/constants";

// export const handlers = [
//   rest.post(API_ENDPOINTS.AUTH.LOGIN, (req, res, ctx) => {
//     return res(ctx.json({ token: "fake-token", user: { id: 1 } }));
//   }),
//   rest.get(API_ENDPOINTS.PRODUCTS.LIST, (req, res, ctx) => {
//     return res(ctx.json({ products: [] }));
//   }),
// ];

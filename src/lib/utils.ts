export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

export const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-US").format(new Date(date));
};

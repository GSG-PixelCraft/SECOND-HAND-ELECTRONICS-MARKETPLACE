interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartItemListProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}

const CartItemList = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
}: CartItemListProps) => {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-4 rounded-lg border border-slate-200 p-4"
        >
          {item.image && (
            <img
              src={item.image}
              alt={item.name}
              className="h-16 w-16 rounded-md object-cover"
            />
          )}
          <div className="flex-1">
            <h3 className="font-medium text-slate-900">{item.name}</h3>
            <p className="text-slate-600">${item.price.toFixed(2)}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 hover:bg-slate-50"
              disabled={item.quantity <= 1}
            >
              -
            </button>
            <span className="w-8 text-center">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 hover:bg-slate-50"
            >
              +
            </button>
          </div>
          <button
            onClick={() => onRemoveItem(item.id)}
            className="text-sm text-red-600 hover:text-red-700"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export default CartItemList;

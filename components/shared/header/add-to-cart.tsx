'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Cart, CartItem } from '@/types';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';
import { Plus, Minus, Loader } from 'lucide-react';
import { useTransition } from 'react';

const AddToCart = ({ cart, item }: { cart?: Cart; item: CartItem }) => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item);
      if (!res.success) return toast.success(res.message);
      //handle success cart
      toast.success(res.message, {
        action: {
          label: 'Go To Cart',
          onClick: () => router.push('/cart'),
        },
      });
    });
  };
  //handle remove from cart

  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);
      if (!res.success) return toast.error(res.message);
      //handle success cart
      toast.success(res.message);
    });
  };

  //check if item already exists in cart
  const itemExists =
    cart &&
    cart?.items.find((cartItem) => cartItem.productId === item.productId);

  return itemExists ? (
    <div>
      <Button
        className="w-full"
        variant={'outline'}
        type="button"
        onClick={handleRemoveFromCart}
      >
        {isPending ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <Minus className="h-4 w-4" />
        )}
      </Button>
      <span className="px-2">{itemExists.qty}</span>
      <Button
        className="w-full"
        variant={'outline'}
        type="button"
        onClick={handleAddToCart}
      >
        {isPending ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      <Plus className="mr-2 h-4 w-4" /> Add To Cart
    </Button>
  );
};

export default AddToCart;

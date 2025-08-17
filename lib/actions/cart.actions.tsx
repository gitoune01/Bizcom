  'use server';

  import { CartItem } from '@/types';
  import { cookies } from 'next/headers';
  import { format } from 'path';
  import { convertToJsObject, formatError, roundToTwo } from '../utils';
  import { auth } from '@/auth';
  import { prisma } from '@/db/prisma';
  import { cartItemSchema, insertCartSchema } from '../validators';
  import { revalidatePath } from 'next/cache';
  import { PrismaClient } from '../generated/prisma';
  import { Prisma } from '@prisma/client';

  //Calculate cart prices
  const calcPrice = (items: CartItem[]) => {
    //before taxes
    const itemsPrice = roundToTwo(
      items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
    );
    //shipping price
    const shippingPrice = roundToTwo(itemsPrice > 100 ? 0 : 10);
    //tax price
    const taxPrice = roundToTwo(itemsPrice * 0.15);
    //total price
    const totalPrice = roundToTwo(itemsPrice + shippingPrice + taxPrice);
    return {
      itemsPrice: itemsPrice.toFixed(2),
      shippingPrice: shippingPrice.toFixed(2),
      taxPrice: taxPrice.toFixed(2),
      totalPrice: totalPrice.toFixed(2),
    };
  };

  //equivalents to api controllers in express
  export async function addItemToCart(data: CartItem) {
    try {
      //check session cart cookie
      const sessionCartId = (await cookies()).get('sessionCartId')?.value;

      if (!sessionCartId) throw new Error('Session Cart Id not found');

      //get session and user ID
      const session = await auth();
      const userId = session?.user?.id ? (session.user.id as string) : undefined;

      //get cart

      const cart = await getMyCart();

      //Parse and validate item
      const item = cartItemSchema.parse(data);

      //find product in db
      const product = await prisma.product.findFirst({
        where: { id: item.productId },
      });

      if (!product) throw new Error('Product not found');

      if (!cart) {
        //create new cart object
        const newCart = insertCartSchema.parse({
          userId: userId,
          items: [item],
          sessionCartId: sessionCartId,
          ...calcPrice([item]),
        });
        //add cart to db
        await prisma.cart.create({ data: newCart });
        //revalidate product page
        revalidatePath('/products/[slug]');

        return {
          success: false,
          message: `${product.name} added to cart`,
        };
      } else {
        //check if item already exists in cart
        const itemExists = cart.items.find(
          (cartItem) => cartItem.productId === item.productId
        );
        console.log('PT01 is EXISTS ?', itemExists);

        if (itemExists) {
          //check stock
          if (product.stock < itemExists.qty + 1) {
            throw new Error(`${product.name} is out of stock`);
          }
          //increase  the quantity
          (cart.items as CartItem[]).find(
            (x) => x.productId === itemExists.productId
          )!.qty = itemExists.qty + 1;
        } else {
          //add item to cart
          //check stock
          if (product.stock < 1) {
            throw new Error(`${product.name} is out of stock`);
          }
          //add item
          (cart.items as CartItem[]).push(item);
        }

        //save to db

        await prisma.cart.update({
          where: { id: cart.id },
          data: {
            items: cart.items as Prisma.CartUpdateitemsInput[],
            ...calcPrice(cart.items as CartItem[]),
          },
        });

        //revalidate product page
        revalidatePath(`/products/${product.slug}`);

        return {
          success: true,
          message: `${product.name} ${
            itemExists ? ' qty updated ' : 'added'
          } to cart`,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: formatError(error),
      };
    }
  }

  //get cart

  export async function getMyCart() {
    //check session cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;

    if (!sessionCartId) throw new Error('Session Cart Id not found');

    //get session and user ID
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    //Get user cart  from the database
    const cart = await prisma.cart.findFirst({
      where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
    });

    if (!cart) return undefined;

    //convert decimals and return cart  to client
    return convertToJsObject({
      ...cart,
      items: cart.items as CartItem[],
      itemsPrice: cart.itemsPrice.toString(),
      totalPrice: cart.totalPrice.toString(),
      shippingPrice: cart.shippingPrice.toString(),
      taxPrice: cart.taxPrice.toString(),
    });
  }

  //remove item from cart
  export async function removeItemFromCart(productId: string) {
    try {
      //check session cart cookie
      const sessionCartId = (await cookies()).get('sessionCartId')?.value;

      if (!sessionCartId) throw new Error('Session Cart Id not found');

      //get session and user ID
      const session = await auth();
      const userId = session?.user?.id ? (session.user.id as string) : undefined;
      //get product to remove from cart
      const product = await prisma.product.findFirst({
        where: { id: productId },
      });

      if (!product) throw new Error('Product not found');

      //Get user cart  from the database
      const cart = await getMyCart();

      if (!cart) throw new Error('Cart not found');
      //check if item already exists in cart
      const itemExists = cart.items.find(
        (cartItem) => cartItem.productId === productId
      );

      if (!itemExists) throw new Error('Item not found in cart');
      //check if only one item or many items in cart
      if (itemExists.qty === 1) {
        //remove item from cart
        cart.items = cart.items.filter((item) => item.productId !== productId);
      } else {
        //decrease  the quantity
        (cart.items as CartItem[]).find(
          (x) => x.productId === itemExists.productId
        )!.qty = itemExists.qty - 1;
      }

      //update cart
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as CartItem[]),
        },
      });

      //revalidate product page
      revalidatePath(`/products/${product.slug}`);

      return {
        success: true,
        message: `${product.name} removed from cart`,
      };
    
    } catch (error) {
      return {
        success: false,
        message: formatError(error),
      };
    }
  }

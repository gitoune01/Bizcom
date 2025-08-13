'use server';
import { prisma } from '../../db/prisma';
import { convertToJsObject } from '../utils';
import { LATEST_PRODUCTS_LIMIT } from '../constants';

//get latest products

export async function getLatestProducts() {

  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: {
      createdAt: 'desc',
    },
  });

  return convertToJsObject(data) as unknown as typeof data;
}


//get single product

export async function getSingleProduct(slug: string) {
  return await prisma.product.findFirst({
    where: {
      slug,
    },
  });

}
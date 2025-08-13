import{ PrismaClient } from "@/lib/generated/prisma"
import sampleData from "./sample-data";


//send data in database
async function main() {
  const prisma = new PrismaClient();
  await prisma.product.deleteMany();
  await prisma.product.createMany({ data: sampleData.products });

console.log("Data seeded",);

}

main()
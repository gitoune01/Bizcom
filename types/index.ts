import {z} from "zod";
import { insertProductSchema } from "@/lib/validators";

export type Product = z.infer<typeof insertProductSchema> & {
  //include all other fields from the schema
  id: string
  rating:string
  createdAt: Date
  numReviews: number
} 
 



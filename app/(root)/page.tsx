import ProductList from "@/components/shared/product/product-list";
import { getLatestProducts } from "@/lib/actions/product.actions";
const Home = async () => {
  const latestProducts = await getLatestProducts();
    
  //use layout sibling to render out (children)
  return (
    <>
       <ProductList data={latestProducts} title="New Arrivals" limit={4}/>
    </>
  );
};

export default Home;

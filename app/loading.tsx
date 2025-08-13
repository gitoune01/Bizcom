import Image from "next/image";
import loader from "@/assets/loader.gif"
const Loading = () => {
  return ( <div style={{height: "100vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
    <Image src={loader} alt="loader" height={150} width={150} />
  </div> );
}
 
export default Loading;
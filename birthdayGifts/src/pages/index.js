import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import Banners from "../components/shop/Banners";
import LayoutOne from "../components/layouts/LayoutOne";
import ShopLayout from "../components/shop/ShopLayout";
import AdminLayout from "../components/admin/adminLayout"
import productData from "../data/product.json";
import useProductData from "../common/useProductData";

export default function Home() {
  const router = useRouter();
  const globalState = useSelector((state) => state.globalReducer);
  const data = useProductData(
    productData,
    globalState.category,
    router.query.q
  );
  return (
    <LayoutOne title="Homepage 1" shopSidebarResponsive={{ xs: 24, lg: 4 }} shopContentResponsive={{ xs: 24, lg: 20 }}>
      <h2 style={{textAlign:'center'}}>Home Page for visitors</h2>
    </LayoutOne>
  );
}

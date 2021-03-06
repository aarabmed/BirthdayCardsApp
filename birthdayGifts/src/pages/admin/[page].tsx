import React, {useState,useContext,useEffect} from "react"

import { useRouter } from "next/router";

import dynamic from 'next/dynamic';
import LayoutOne from "components/layouts/LayoutOne";

import Spinner from "components/spin/spiner"
import checkAuth from 'common/auth' 
import { parseCookies } from "nookies";
import axios from "axios";



const AdminLayout = dynamic(
  import('../../components/admin/adminLayout')
);

const axiosHeader = (value)=>{
  const {token} = parseCookies()
  const config = {
    headers: { Authorization: `Bearer ${token}` }, 
    params:value
  };
  return config
}



const Index = ()=> {
  const router = useRouter();
  const [loading, setLoading] = useState(true)

  
  const{query} = router
  useEffect(()=>{
    if(loading){
      setLoading(false)
    }
    
  },[loading])

  
  
  if(loading) return <div className='indexSpinner'><Spinner/></div>

  return (
    <LayoutOne  title="Homepage 1" SidebarResponsive={{md:5,sm:5,lg:4}} ContentResponsive={{ lg: 20 }}>
          <AdminLayout
            pageType={query.page.toString()}
          />
    </LayoutOne>     
  );
}





export const getServerSideProps = async (ctx) => {

  const isAuth = checkAuth(ctx)  
  if(!isAuth){
    return {
        redirect: {
          permanent: false,
          destination: '/admin/login',
        },
    }
  }

  return {
    props: {},
  };
}

export default Index


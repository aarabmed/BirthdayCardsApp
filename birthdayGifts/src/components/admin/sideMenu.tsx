import React, { ReactFragment, useEffect } from "react";
import Link from "next/link"; 
import Router from "next/router"
import { useSelector, useDispatch } from "react-redux";
import { MENU_ADMIN } from "../../common/defines-admin";

import Menu from 'components/header/elements/components/menu'


interface Props {
  className?:string;
  type:string;
}

function AdminLeftSidebar() {

  const dispatch = useDispatch();
  const {route} = useSelector((state) => state.globalReducer);
  const {query} = Router
   
  
  useEffect(()=>{
    
  },[])


  return (
    <div className="admin-sidebar">
      <div className="menu-logo">
              <Link href={process.env.PUBLIC_URL + "/"}>
                <a>
                  <img
                    src={process.env.PUBLIC_URL + "/assets/images/birthday-cards-logo.png"}
                    alt="Logo"
                  />
                </a>
              </Link>
      </div>
      <div className="menu-line"></div>
      <div className="admin-sidebar__subcategory">
        <Menu items={MENU_ADMIN} />
      </div>
    </div>
  );
}

export default React.memo(AdminLeftSidebar);

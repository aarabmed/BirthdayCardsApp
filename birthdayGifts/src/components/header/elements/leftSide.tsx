import React ,{useEffect,useState} from "react";
import Router from "next/router"
import { Drawer} from "antd";
import { useSelector, useDispatch ,batch} from "react-redux";
import { CloseOutlined } from "@ant-design/icons";


import {MENU_ADMIN } from "common/defines-admin"
import Menu from 'components/header/elements/components/menu'


function LeftSide({mobileMenu}) {
  const [menuStatus, setMenuStatus] = useState(false);

  useEffect(()=>{
    if(!mobileMenu){
      setMenuStatus(false)
    }
  },[mobileMenu])
 
  return (
    <>
      <div className="head-leftSide" >
          {mobileMenu&&
            <a
                className="menu-sidebar-opener"
                onClick={(e) => {
                  e.preventDefault(); 
                  setMenuStatus(true);
                }}
            >
                <div></div>
                <div></div>
                <div></div>
            </a>
          }
      </div>
      <Drawer
        placement="right"
        title={`MENU`}
        closable={true}
        onClose={() => setMenuStatus(false)}
        closeIcon={
          <>
            <p>Close</p> <CloseOutlined />
          </>
        }
        visible={menuStatus}
        width={445}
        className="menu-side"
      >
        <Menu className='menu-side-mobile' items={MENU_ADMIN}/>
      </Drawer>
    </>
  );
}

export default React.memo(LeftSide);

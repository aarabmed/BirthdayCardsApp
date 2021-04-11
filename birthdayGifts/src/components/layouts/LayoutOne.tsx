import React, {useState,useRef} from "react";
import Head from "next/head";
import { BackTop ,Row,Col} from "antd";

import Header from "../header/Header";

import Container from "../other/Container";
import LeftSideMenu from "../admin/sideMenu";


   
function LayoutOne({
  title,
  children,
  SidebarResponsive,
  ContentResponsive
}) {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [newContentResonsive, setnewContentResonsive] = useState({});
  const backToTop = useRef(null);
  function reportWindowSize() {
      if(window.innerWidth<=820){
        if(mobileMenu===true){
          return
        }else{
          setMobileMenu(true)
          setnewContentResonsive({xs:24,sm:24,md:24})
        }
      }else{
        if(mobileMenu===false){
          return
          }else{
          setMobileMenu(false)
          setnewContentResonsive({md:19,sm:19})
        }
      }

  }
  window.onresize = reportWindowSize;
  React.useEffect(()=>{
    reportWindowSize()
  },[])

 
  
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
           
      <div className={`content-admin`}>
            <Container type={''} cName={' container-admin'}>
              <Row gutter={[0, 0]}>
              
                {!mobileMenu&&
                <Col {...SidebarResponsive} className="sideMenu">
                  <div className="gutter-row menu-row">
                    <LeftSideMenu />
                  </div>
                </Col>}

                <Col className="content-row" {...ContentResponsive} {...newContentResonsive}>
                  <Header mobileMenu={mobileMenu}/>
                  <Row ref={backToTop} className="gutter-row content-side">
                        {children}
                        <BackTop target={()=>backToTop.current} />
                  </Row>
                </Col>

              </Row>
            </Container>
      </div>      
    </>
  );
}

export default React.memo(LayoutOne);

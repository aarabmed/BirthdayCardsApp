import React from "react";
import dynamic from 'next/dynamic';
import { Row, Col} from "antd";



import Footer from "../footer/Footer"

type props = {
  pageType:string
}

const User = dynamic(
  import('./user')
)
const Tag = dynamic(
  import('./tag')
)
const Categories = dynamic(
  import('./category')
)


const AdminLayout:React.FC<props> =({
  pageType,
})=>{

  const RenderPage:React.FC<{type:string}>= ({type})=>{
    switch (type) {
      case 'users':
        return(
          <User />
        )
  
      case 'cards':
        return <>{console.log('Card Page')}</>
      case 'categories':
        return(
          <Categories/>
        )
      case 'tags':
        return(
          <Tag/>
        )
      default:
        return(
          <>{console.log('dashboard')}</>
        )
    }
  }
  
  return (
    <Row gutter={[0,10]} className={'main-page'}>
          <Col className='main-content'>
            <RenderPage type={pageType} />
          </Col>
    </Row>
);
} 



export default AdminLayout

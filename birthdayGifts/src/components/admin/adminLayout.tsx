import React from "react";
import dynamic from 'next/dynamic';
import { Row, Col} from "antd";



import Footer from "../footer/Footer"

type props = {
  pageType:string
}

const Users = dynamic(
  import('./user/userIndex')
)
const Tags = dynamic(
  import('./tag/tagIndex')
)
const Categories = dynamic(
  import('./category/categoryIndex')
)

const Cards = dynamic(
  import('./cards')
)


const AdminLayout:React.FC<props> =({
  pageType,
})=>{

  const RenderPage:React.FC<{type:string}>= ({type})=>{
    switch (type) {
      case 'users':
        return <Users />
  
      case 'cards':
        return <Cards/>

      case 'categories':
        return <Categories/>

      case 'tags':
        return <Tags/>
        
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

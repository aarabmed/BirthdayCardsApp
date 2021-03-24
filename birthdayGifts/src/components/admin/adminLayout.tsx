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

  const renderPage= (pageType):React.ReactNode=>{

    switch (pageType) {
      case 'users':
        return(
          <User/>
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
    <Row gutter={[0,10]} className={'content-page'}>
          <Col>
            {renderPage(pageType)}
          </Col>
    </Row>
);
} 



export default AdminLayout

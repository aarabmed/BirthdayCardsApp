import React from "react";
import dynamic from "next/dynamic";
import { Space, Divider} from "antd";

const Category = dynamic(
    import('./components/category')
);

const SubCategory = dynamic(
  import('./components/sub-category')
)

const SubCategoryChild = dynamic(
  import('./components/sub-category-child')
)


const CategoryIndex =()=>{
  return (
            <Space size={40} direction={'vertical'}>
                <h3 className='contentTitle'>{'< '}Category Management </h3>
                <Category/>
                  <Divider/>
                <SubCategory/>
                  <Divider/>
                <SubCategoryChild/>
            </Space>
            
  );
} 

export default CategoryIndex

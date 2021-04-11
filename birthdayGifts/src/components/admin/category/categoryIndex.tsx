import React from "react";
import dynamic from "next/dynamic";
import { Space, Divider} from "antd";

const Category = dynamic(
    import('./components/tables/category')
);

const SubCategory = dynamic(
  import('./components/tables/sub-category')
)

const SubCategoryChild = dynamic(
  import('./components/tables/sub-category-child')
)


const CategoryIndex =()=>{
  return (
          <>
            <Space size={40} direction='vertical'>
                <h3 className='contentTitle'>{'< '}Category Management </h3>
            </Space>
            <>
                <Category/>
                  <Divider/>
                <SubCategory/>
                  <Divider/>
                <SubCategoryChild/>
            </>
          </> 
  );
} 

export default CategoryIndex

import React from "react";
import {Table, Button} from "antd";
import Spinner from "../../../../spin/spiner"
import useSWR from "swr"
import axios from 'axios'
import moment from 'moment'
import DynamicCategory from 'components/admin/category/components/categoryType'
import {subCategoryColumns } from './columns/categoryColumns'
import { SUB_CATEGORIES } from "common/apiEndpoints";


const SubCategory=()=>{
    const fetcher = url => axios.get(url).then(res => res.data)
    const { data, error, mutate } = useSWR(SUB_CATEGORIES, fetcher)

    const tableHeader = () =>(
        <div className='tableHeader'>
            <DynamicCategory type='sub-category' mode='add'  runMutate={runMutate}/>
        </div>
    )

    const runMutate =()=> mutate()

    const SubCategories = () =>{
        let newData = [];
        
        if(error){
        return (
            <h5>No data to load !!</h5>
        )
        }
        if (!data) return <Spinner />
        else newData = data.data.map(elm=>({
        ...elm,
        key:elm._id,
        name:elm.name,
        slug:elm.slug,
        image:elm.image,
        createdAt:moment(elm.createdAt).format('DD MMM YYYY'),
        updatedAt:moment(elm.updatedAt).format('DD MMM YYYY'),
        childrenSubCategory:elm.childrenSubCategory,
        status:elm.status,
        }))

    
        return <Table  scroll={{x:1170}} columns={subCategoryColumns} dataSource={newData} title={()=>tableHeader()}/>
    }

    return (
        <>
            <SubCategories/>
        </>
    );
} 

export default SubCategory

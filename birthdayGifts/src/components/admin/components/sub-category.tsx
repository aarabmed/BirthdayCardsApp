import React from "react";
import {Table, Button} from "antd";
import Spinner from "../../spin/spiner"
import useSWR from "swr"
import axios from 'axios'
import moment from 'moment'

import {subCategoryColumns } from '../tables/categoryColumns'


const SubCategory=()=>{
    const fetcher = url => axios.get(url).then(res => res.data)

    const tableHeader = (name) =>(
        <div className='tableHeader'>
            <Button type="primary" >Add a {name}</Button>
        </div>
    )
    const subCategories = () =>{
        const { data, error } = useSWR('/api/sub-categories', fetcher)
        let newData = [];
        
        if(error){
        return (
            <h5>No data to load !!</h5>
        )
        }
        if (!data) return <Spinner />
        else newData = data.data.map(elm=>(console.log('ELM:',elm),{
        ...elm,
        key:elm._id,
        name:elm.name,
        slug:elm.slug,
        image:elm.image.path,
        createdAt:moment(elm.createdAt).format('DD MMM YYYY'),
        updatedAt:moment(elm.updatedAt).format('DD MMM YYYY'),
        childrenSubCategory:elm.childrenSubCategory,
        status:[elm.status],
        }))

    
        return(
         
            <>{console.log('subCategoryColumns:',newData)}<Table className='userTable' scroll={{x:1170}} columns={subCategoryColumns} dataSource={newData} title={()=>tableHeader('sub-category')}/></>
        )
    }

    return (
        <div>
            {subCategories()}
        </div>
    );
} 

export default SubCategory

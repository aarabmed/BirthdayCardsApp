import React from "react";
import {Table,Button} from "antd";
import Spinner from "../../spin/spiner"
import useSWR from "swr"
import axios from 'axios'
import moment from 'moment'

import {childrenColumns } from '../tables/categoryColumns'


const SubCategoryChild=()=>{
    const fetcher = url => axios.get(url).then(res => res.data)

    const tableHeader = (name) =>(
        <div className='tableHeader'>
            <Button type="primary" >Add a {name}</Button>
        </div>
    )
    const items = () =>{
        const { data, error } = useSWR('/api/sub-items', fetcher)
        let newData = [];
        
        if(error){
        return (
            <h5>No data to load !!</h5>
        )
        }
        if (!data) return <Spinner />
        else newData = data.data.map(elm=>({
            ...elm,
            tags:elm.tags.map(e=>e.name),
            key:elm._id,
            name:elm.name,
            slug:elm.slug,
            image:elm.image.path,
            createdAt:moment(elm.createdAt).format('DD MMM YYYY'),
            updatedAt:moment(elm.updatedAt).format('DD MMM YYYY'),
            status:[elm.status],
        }))

    
        return(
           <>{console.log('subCategoryChild',newData)} <Table className='userTable' columns={childrenColumns} dataSource={newData} scroll={{x:1170}} title={()=>tableHeader('sub-category child')}/></>
        )
    }

    return (
        <div>
            {items()}
        </div>
    );
} 

export default SubCategoryChild

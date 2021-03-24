import React from "react";
import { Table, Button} from "antd";

import useSWR from "swr"
import axios from 'axios'
import moment from 'moment'

import {categoryColumns,subCategoryColumns,childrenColumns } from '../tables/categoryColumns'
import Spinner from '../../spin/spiner'



const Category=()=>{
    const fetcher = url => axios.get(url).then(res => res.data)

    const tableHeader = (name) =>(
        <div className='tableHeader'>
            <Button type="primary" >Add a {name}</Button>
        </div>
    )
    const categories = () =>{
        const { data, error } = useSWR('/api/categories', fetcher)
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
            image:elm.image.path,
            createdAt:moment(elm.createdAt).format('DD MMM YYYY'),
            updatedAt:moment(elm.updatedAt).format('DD MMM YYYY'),
            status:[elm.status],
            tags:elm.subCategory.map(e=>[...e.tags.map(el=>el.name)])[0]??[],
            subCategory:elm.subCategory.map(e=>e.name)
        }))

        return(
            <Table className='userTable' scroll={{x:1170}} columns={categoryColumns} dataSource={newData}  title={()=>tableHeader('category')}/>
        )
    }

    return (
        <div>
            {categories()}
        </div>
    );
} 

export default Category

import React from "react";
import { Table, Button} from "antd";

import useSWR,{mutate} from "swr"
import axios from 'axios'
import moment from 'moment'

import DynamicCategory from '@/components/modals/CategoryType'
import {categoryColumns,subCategoryColumns,childrenColumns } from '../tables/categoryColumns'
import Spinner from '../../spin/spiner'




const Category=()=>{
    const fetcher = url => axios.get(url).then(res => res.data)
    const { data,mutate, error } = useSWR('/api/categories', fetcher)
    const tableHeader = () =>(
        <div className='tableHeader'>
            <DynamicCategory type='category' mode='add'  runMutate={runMutate}/>
        </div>
    )

    const runMutate =()=> mutate()
    const categories = () =>{
        
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
            status:elm.status,
            tags:elm.subCategory.map(e=>[...e.tags.map(el=>el.name)])[0]??[],
            subCategory:elm.subCategory.map(e=>e.name)
        }))

        return(
            <Table className='userTable' scroll={{x:1170}} columns={categoryColumns} dataSource={newData}  title={()=>tableHeader()}/>
        )
    }

    return (
        <div>
            {categories()}
        </div>
    );
} 

export default Category
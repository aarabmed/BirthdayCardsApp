import React from "react";
import { Table, Button} from "antd";

import useSWR,{mutate} from "swr"
import axios from 'axios'
import moment from 'moment'

import DynamicCategory from '../categoryType'
import {categoryColumns} from './columns/categoryColumns'
import Spinner from 'components/spin/spiner'
import { CATEGORIES } from 'common/apiEndpoints'




const Category=()=>{
    const fetcher = url => axios.get(url).then(res => res.data)
    const { data,mutate, error } = useSWR(CATEGORIES, fetcher)
    
    const tableHeader = () =>(
        <div className='tableHeader'>
            <DynamicCategory type='category' mode='add'  runMutate={runMutate}/>
        </div>
    )

    const runMutate =()=> mutate()
    const Categories = () =>{
        
        let newData = [];
        
        if(error){
            return (
                <h5>No data to load !!</h5>
            )
        }

        if (!data) return <Spinner />
        else newData = data.data.map(elm=>{
            let tagsChildren = []
            let tagsSubCat = []
            let subChildren =[]

            elm.subCategory.map(e=>e.tags.map(i=>tagsSubCat.push(i)))
            elm.subCategory.map(sub=>sub.childrenSubCategory.map(e=>e.tags.map(i=>tagsChildren.push(i))))
            elm.subCategory.map(sub=>sub.childrenSubCategory.map(e=>subChildren.push({_id:e._id,name:e.name})))


           return ({
            ...elm,
            key:elm._id,
            name:elm.name,
            slug:elm.slug,
            image:elm.image.path,
            createdAt:moment(elm.createdAt).format('DD MMM YYYY'),
            updatedAt:moment(elm.updatedAt).format('DD MMM YYYY'),
            status:elm.status,
            childrenSubCategory:subChildren,
            subCategory:elm.subCategory.map(e=>({name:e.name,_id:e._id})),
            tags:[...new Map([...tagsChildren,...tagsSubCat].map(item => [item['_id'], item])).values()],
            })
        })

        return(
            <Table  scroll={{x:1170}} columns={categoryColumns} dataSource={newData}  title={()=>tableHeader()}/>
        )
    }

    return (
        <>
            <Categories/>
        </>
    );
} 

export default Category

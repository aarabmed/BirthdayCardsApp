import React from "react";
import {Table,Button} from "antd";
import Spinner from "../../spin/spiner"
import useSWR from "swr"
import axios from 'axios'
import moment from 'moment'
import DynamicCategory from 'components/modals/Category'
import {childrenColumns } from '../tables/categoryColumns'


const SubCategoryChild=()=>{
    const fetcher = url => axios.get(url).then(res => res.data)
    const { data, error ,mutate } = useSWR('/api/sub-items', fetcher)

    const tableHeader = () =>(
        <div className='tableHeader'>
            <DynamicCategory type='sub-category-child' mode='add'  runMutate={runMutate}/>
        </div>
    )

    const runMutate =()=> mutate()

    const items = () =>{
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
            status:elm.status,
        }))

    
        return(
           <><Table className='userTable' columns={childrenColumns} dataSource={newData} scroll={{x:1170}} title={()=>tableHeader()}/></>
        )
    }

    return (
        <div>
            {items()}
        </div>
    );
} 

export default SubCategoryChild

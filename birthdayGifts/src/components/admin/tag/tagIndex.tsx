import React from "react";
import { Table, Button} from "antd";
import Spinner from "../../spin/spiner"
import useSWR from "swr"
import axios from 'axios'
import moment from 'moment'

import {tagColumns } from './tables/tagColumns'
import AddTag from "./components/tagType";
import { TAGS } from "common/apiEndpoints";


const TagIndex =()=>{
  const fetcher = url => axios.get(url).then(res => res.data)
  const { data, error ,mutate} = useSWR(TAGS, fetcher)

  const tableHeader = () =>(
    <div className='tableHeader'>
      <AddTag mode='add' runMutate={()=>mutate()} />
    </div>
  )

  const TagPage = () =>{
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
      createdAt:moment(elm.createdAt).format('DD MMM YYYY'),
      status:elm.status,
    }))


    return(
        <Table columns={tagColumns} dataSource={newData} scroll={{x:1170}} title={tableHeader}/>
    )
  }

  return <TagPage/>
} 

export default TagIndex

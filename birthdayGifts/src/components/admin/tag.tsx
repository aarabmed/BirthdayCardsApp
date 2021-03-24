import React from "react";
import { Table, Button} from "antd";
import Spinner from "../spin/spiner"
import useSWR from "swr"
import axios from 'axios'
import moment from 'moment'

import {tagColumns } from './tables/tagColumns'


const TagIndex =()=>{
  const fetcher = url => axios.get(url).then(res => res.data)

      const tableHeader = () =>(
      <div className='tableHeader'>
        <Button type="primary" >Add a Tag</Button>
      </div>
  )
  const TagPage = () =>{
    const { data, error } = useSWR('/api/tags', fetcher)
    let newData = [];

    if(error){
      return (
        <h5>No data to load !!</h5>
      )
    }
    if (!data) return <Spinner />
    else newData = data.data.map(elm=>({
      key:elm._id,
      name:elm.name,
      slug:elm.slug,
      createdAt:moment(elm.createdAt).format('DD MMM YYYY'),
      status:[elm.status],
    }))


    return(
        <Table className='userTable' columns={tagColumns} dataSource={newData} scroll={{x:1170}} title={tableHeader}/>
    )
  }

  return (
          <div>
             {TagPage()}
          </div>
  );
} 

export default TagIndex

import React ,{useState,useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";

import { LoadingOutlined } from '@ant-design/icons';
import { Row, Col,Table, Tag, Space, Button,Spin} from "antd";
import useSWR,{mutate} from "swr"
import axios from 'axios'
import AddUserModal from '../modals/addUser'
import {userColumns } from './tables/userColumns'
import Spinner from '../spin/spiner'
import { parseCookies } from "nookies";


const axiosHeader = ()=>{
  const {token} = parseCookies()
  const config = {
      headers: { Authorization: `Bearer ${token}` }
  };
  return config
}

const userPage =()=>{
  const [isLoading, setIsLoading] = useState(true);
  const {currentUser} = useSelector((state) => state.userReducer);
  const {authority} = currentUser

  const fetcher = url => axios.get(url,axiosHeader()).then(res => res.data)

  const { data, error, mutate } = useSWR('/api/users', fetcher)
  
  

  const onFetch = () => {
    setIsLoading(true)
    mutate()
  }

  useEffect(() => {
  
     if(isLoading){
      setIsLoading(false)
    }  
  }, [data]); 
  
  const tableHeader = () =>(
      <div className='tableHeader'>
        <AddUserModal fetching={onFetch}/>
      </div>
  )
  const pageUser = () =>{
    let newData = []

    if(error){
      return (
        <h5>No data to load !!</h5>
      )
    }
    if (!data) return <Spinner />
    else newData= data.data.map(elm=>({
      key:elm._id,
      userName:elm.userName,
      email:elm.email,
      authority:elm.authority,
      status:[elm.status],
    }))

    

    return(
        <>
          <Table className='userTable' loading={isLoading} columns={userColumns} dataSource={newData} scroll={{x:1170}} /* tableLayout={'unset'} */ title={authority===('ADMIN'||'SUPER-ADMIN')?tableHeader:null} pagination={{position:['bottomCenter']}}/>
        </>
    )
  }

  return (
          <div>
             {pageUser()}
          </div>
  );
} 

export default userPage

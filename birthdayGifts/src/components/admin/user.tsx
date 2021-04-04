import React ,{useState,useEffect} from "react";
import { useSelector} from "react-redux";

import {Table} from "antd";
import useSWR from "swr"
import axios from 'axios'
import AddUserModal from '../modals/addUser'
import {userCol } from './tables/userColumns'
import Spinner from '../spin/spiner'
import { parseCookies } from "nookies";
import { USERS } from "common/apiEndpoints";

import UserHeader from './components/user/userHeader'

const axiosHeader = ()=>{
  const {token} = parseCookies()
  const config = {
      headers: { Authorization: `Bearer ${token}` }
  };
  return config
}



const userPage =()=>{
  const [userInfo, setUserInfo] = useState(undefined)
  const [refreachError, setRefreachError] = useState(false)
  const {currentUser} = useSelector((state) => state.userReducer);
  const {authority} = currentUser

  const fetcher = url => axios.get(url,axiosHeader()).then(res => res.data)
  const { data, error, mutate,isValidating } = useSWR(USERS, fetcher)

  const refreachUserInfo=()=>{
    mutate().then((res)=>{
      const user = res.data.find(elm=>elm._id===userInfo.key)
      if(user){
        setRefreachError(false)
        setUserInfo(user);
        return
      }
      setRefreachError(true)
    })
  }

  useEffect(()=>{
    if(refreachError){
      refreachUserInfo()
    }
  },[])


  const toUsersList = ()=>{
    setUserInfo(undefined)
  }


  const Users = () =>{

      const onFetch = () => {
        mutate()
      }


      const getUser=(item)=>{
        setUserInfo(item)
      }


      const tableHeader = () =>(
        <div className='tableHeader'>
          <AddUserModal fetching={onFetch}/>
        </div>
      )

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
        status:elm.status,
        createdAt:elm.createdAt
      }))

      
      return(
          <>
            <Table loading={isValidating} columns={userCol(getUser)} dataSource={newData} scroll={{x:1150}} /* tableLayout={'unset'} */ title={authority===('ADMIN'||'SUPER-ADMIN')?tableHeader:null} pagination={{position:['bottomCenter']}}/>
          </>
      )
  }
  


  const SingleUser =({userInfo,runRefreach,toUsersList})=>{

    return <>
       <UserHeader userInfo={userInfo} refreachData={runRefreach} toUsersList={toUsersList}/>
    </>
  } 


  const props = {
    userInfo,
    runRefreach:refreachUserInfo,
    toUsersList,
  }




  return userInfo?<SingleUser {...props} />:<Users/>  
} 

export default React.memo(userPage)

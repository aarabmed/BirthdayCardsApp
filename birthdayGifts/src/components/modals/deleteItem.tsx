import React ,{useState} from 'react'
import Icon from '@ant-design/icons';
import { useSelector } from "react-redux";
import { Modal, Button, Space } from 'antd';
import axios from 'axios'
import Icons from 'assets/icons'
import { parseCookies } from 'nookies';
import { mutate } from 'swr';
import checkAuth from 'common/auth'
import redirectToLogin from 'common/redirectToLogin'

type itemProps ={
  itemId:string,
  itemName:string,
  targetUrl:string,
  type:string,
}

const SuccussIcon  = ()=> <Icon component={Icons.successIcon} />
const FailIcon  = ()=> <Icon component={Icons.failIcon} />

const deleteFunction=({itemId,type,targetUrl,itemName}:itemProps)=>{
     const {currentUser} = useSelector((state) => state.userReducer);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isDeleted, setIsDeleted] = useState(false);
    const [visible, setVisible] = useState(false);

    const handleCancel =()=>{
        setVisible(false)
    }

    const showModal = async ()=>{
        const isAuth = await checkAuth()
        if(isAuth){
          setVisible(true)
          return
        }
        redirectToLogin()
    }

    const axiosHeader = ()=>{
      const {token} = parseCookies()
      const config = {
          headers: { Authorization: `Bearer ${token}` }
      };
      return config
    }

    const confirmDelete =()=>{
      setConfirmLoading(true)
      const {userId} = currentUser
      const axiosInstance = axios.create({
        validateStatus: function (status)
        {
            return true
        }
      });
      //const url = mode==='edit'?`/api/categories/`:'/api/categories/new'
         axiosInstance.patch(
          `${targetUrl}/delete/${itemId}`,
          {currentUserId:userId},
          axiosHeader(),
        ).then(res=>{
          console.log('Cat-res:',res)
            if (res.status===200) { 
                mutate(targetUrl)
                setTimeout(() => {
                  setConfirmLoading(false);
                  setMessage(res.data.message)
                  setIsDeleted(true)
                }, 1000);
            }else{
                setConfirmLoading(false);
                setIsDeleted(false)
                setMessage(res.data.error.message)
            }
        }).catch(e=>{
            console.log('Error:',e)
        })
    }

    const withProps = isDeleted ? {
      footer:null
    }:{}

    return(
    <div>
      <a onClick={showModal}> delete </a>
      <Modal
          destroyOnClose={true}
          title={false}
          visible={visible}
          centered={true}
          confirmLoading={confirmLoading}
          onCancel = {handleCancel}
          onOk={confirmDelete}
          cancelText='Return'
          okText = {message?'Try again':'Confirm'}
          {...withProps}
          
        >
          {!message?
          <div className="warning-modal-container">
            <h4>You are about to delete: {type}</h4>
            <p> a {type} by name : <span style={{fontSize:'bold'}}> {itemName}</span></p>
          </div>:<div className='warrningModal'>
            {isDeleted?<SuccussIcon/>:<FailIcon/>}<span> {message}</span>
          </div>
          }

      </Modal>
    </div>
    )
}

export default deleteFunction
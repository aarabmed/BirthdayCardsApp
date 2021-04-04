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

type DeleteButton = 'link'|'regular'
export type deleteProps ={
  itemId:string,
  itemName:string,
  targetUrl:string,
  type:string,
  button:DeleteButton,
  onDelete?:()=>void,
}

const SuccussIcon  = ()=> <Icon component={Icons.successIcon} />
const FailIcon  = ()=> <Icon component={Icons.failIcon} />

const deleteFunction=({itemId,type,targetUrl,itemName,button,onDelete}:deleteProps)=>{
     const {currentUser} = useSelector((state) => state.userReducer);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isDeleted, setIsDeleted] = useState(false);
    const [visible, setVisible] = useState(false);

    const handleCancel =()=>{
        setVisible(false)
        if(isDeleted){
          onDelete()
        }
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
                setMessage(res.data.message)
            }
        }).catch(e=>{
            console.log('Error:',e)
        })
    }

    const withProps = isDeleted ? {
      footer:null
    }:{}

    return(
    <>
      {button==='link'?<a onClick={showModal}> delete </a>:<Button key="1111" type='primary' danger onClick={showModal}>Delete</Button>}
      <Modal
          destroyOnClose={true}
          title={false}
          visible={visible}
          centered={true}
          confirmLoading={confirmLoading}
          onCancel = {handleCancel}
          onOk={confirmDelete}
          cancelText='Return'
          width={400}
          okText = {message?'Try again':'Confirm'}
          {...withProps}
          
        >
          {!message?
          <div className="warning-modal-container">
            <h4>Are you sure of removing this item? </h4>
            <p> Type : <span >{type}</span></p> 
            <p> Name : <span > {itemName}</span></p>
          </div>:<div className='warrningModal'>
            {isDeleted?<SuccussIcon/>:<FailIcon/>}<span> {message}</span>
          </div>
          }

      </Modal>
    </>
    )
}

export default deleteFunction
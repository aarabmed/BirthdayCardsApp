import React ,{useEffect, useState} from 'react'
import Icon from '@ant-design/icons';
import { useSelector } from "react-redux";
import { Modal, Button, Space } from 'antd';
import axios from 'axios'
import Icons from 'assets/icons'
import { parseCookies } from 'nookies';
import { mutate } from 'swr';
import isAuth from 'common/isAuthenticated'

export type deleteProps ={
  itemId:string,
  itemName:string,
  targetUrl:string,
  type:string,
  button?:"link" | "regular",
  onDelete?:()=>void,
  doRefrech?:()=>void,
  customButton?:JSX.Element
}

const SuccussIcon  = ()=> <Icon component={Icons.successIcon} />
const FailIcon  = ()=> <Icon component={Icons.failIcon} />

const deleteFunction=({itemId,type,targetUrl,itemName,button,onDelete,doRefrech,customButton}:deleteProps)=>{
     const {currentUser} = useSelector((state) => state.userReducer);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isDeleted, setIsDeleted] = useState(false);
    const [visible, setVisible] = useState(false);

    const handleCancel =()=>{
        setVisible(false)
        if(isDeleted && typeof(onDelete) === 'function'){
          onDelete()
        }
        if(isDeleted && typeof(doRefrech) !== 'function'){
          mutate(targetUrl)
        }
    }

    
    useEffect(()=>{
      if(isDeleted && typeof(doRefrech) === 'function'){
        doRefrech()
      }
    },[isDeleted])

    const showModal = ()=>{
      isAuth(()=>setVisible(true))
    }

    const axiosHeader = ()=>{
      const {token} = parseCookies()
      const config = {
          headers: { Authorization: `Bearer ${token}` }
      };
      return config
    }



    const confirmDelete =()=>{
      isAuth(()=>{
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
                    setIsDeleted(true)
                    setMessage(res.data.message)
                  }, 1000);
              }else{
                  setConfirmLoading(false);
                  setIsDeleted(false)
                  setMessage(res.data.message)
              }
          }).catch(e=>{
              console.log('Error:',e)
          })
      })
    }

    const withProps = isDeleted ? {
      footer:null
    }:{}

    const CButton = () =>{
      if(customButton){
        return <div onClick={showModal}>{customButton}</div>
      }
      if(button==='link') return <a onClick={showModal}> delete </a>
      else return <Button key="1111" type='primary' danger onClick={showModal}>Delete</Button>
    }

    return(
    <>
      <CButton/>
      <Modal
          //destroyOnClose={true}
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
          forceRender={true}
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
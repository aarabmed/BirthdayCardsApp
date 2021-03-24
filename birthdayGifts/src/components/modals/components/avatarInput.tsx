
import React,{useState,useEffect} from 'react';
import { Avatar,Popover,Button } from 'antd';
import {CheckCircleTwoTone} from '@ant-design/icons';

const  AvatarInput =({getAvatarValue})=>{
    const [avatarValue, setAvatarValue] = useState(1);
    const [avatarPopoverStatus, setAvatarPopoverStatus] = useState(false)
    

    useEffect(()=>{
        getAvatarValue(avatarValue)
    },[])

    const closePopover = ()=>{
      setAvatarPopoverStatus(false)
    }

    const handleVisibleChange=(visible)=>{
      
        setAvatarPopoverStatus(visible)
      
    }


    const onAvatarClick =(e)=>{
      const value = +e.target.parentElement.getAttribute('data-index')

      if(typeof(value) === 'number' && value>0 && value<16){
        setAvatarValue(value)
        getAvatarValue(value)
      }
    }

    const xx = <p>med</p>

    const items = [
                <img key='1'
                  src={process.env.PUBLIC_URL + "/assets/avatars/1.png"}
                />,
              
                <img
                      src={process.env.PUBLIC_URL + "/assets/avatars/2.png"}
                />,
              
                <img
                    src={process.env.PUBLIC_URL + "/assets/avatars/3.png"}
                  />,
              
                <img
                    src={process.env.PUBLIC_URL + "/assets/avatars/4.png"}
                  />,
              
                <img
                    src={process.env.PUBLIC_URL + "/assets/avatars/5.png"}
                  />,
              
                <img
                    src={process.env.PUBLIC_URL + "/assets/avatars/6.png"}
                  />,
              
                <img
                    src={process.env.PUBLIC_URL + "/assets/avatars/7.png"}
                  />,
              

                <img
                      src={process.env.PUBLIC_URL + "/assets/avatars/8.png"}
                  />,
              
                <img
                      src={process.env.PUBLIC_URL + "/assets/avatars/9.png"}
                />,
              

                <img
  
                    src={process.env.PUBLIC_URL + "/assets/avatars/10.png"}
                />,
              

                <img
  
                    src={process.env.PUBLIC_URL + "/assets/avatars/11.png"}
                />,
              

                <img
  
                    src={process.env.PUBLIC_URL + "/assets/avatars/12.png"}
                />,
              

                <img
  
                    src={process.env.PUBLIC_URL + "/assets/avatars/13.png"}
                />,
              

                <img
  
                    src={process.env.PUBLIC_URL + "/assets/avatars/14.png"}
                />,
              

                <img
  
                    src={process.env.PUBLIC_URL + "/assets/avatars/15.png"}
                /> 
    ]
    const checkedIcon = <CheckCircleTwoTone key="1"/>
    const newItems = items.map((item,index)=><div className="singleAvatar" key={index} data-index={index+1}>{ avatarValue===index+1?(<div className="active"><CheckCircleTwoTone key="1"/>{item}</div>):item}</div>)
      return (
        <div className='avatar-container'>
           <Popover
              content={<div className='avatarList' onClick={onAvatarClick} >{newItems}<Button  block type='default' className='avatar-close-button'  onClick={closePopover}>Close</Button></div>}
              title="Choose your own avatar"
              trigger="click"
              visible={avatarPopoverStatus}
              onVisibleChange={handleVisibleChange}
              placement="right"
            >
               <Avatar
                  size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                  src={avatarValue?process.env.PUBLIC_URL + `/assets/avatars/${avatarValue}.png`: process.env.PUBLIC_URL + "/assets/avatars/1.png"}
                />
              
            </Popover>
        </div>
      ) 
}

export default AvatarInput
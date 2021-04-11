import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from "react-redux";
import {withAuth} from 'context/helper'

import { Modal, Button,Form,
    Input,
    Select,
} from "antd";

import axios from 'axios'

import { SIGNUP } from 'common/apiEndpoints';


 const viewCard= ({card,isModalOpen,closeModal}) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const {currentUser} = useSelector((state) => state.userReducer);
    const {authority,userId} = currentUser

    const router = useRouter();
    
    useEffect(()=>{
        if(isModalOpen){
            showModal()
        }
    },[isModalOpen])
    
    

    const showModal = () => {
        withAuth(setIsModalVisible(true))
    };

  

    const handleCancel = () => {
        closeModal()
        setIsModalVisible(false); 
    };
    

    

    
      
  return (
    <>
      <Modal visible={isModalVisible}  onCancel={handleCancel} width={700} title={`Card id:${'12345'}`}>
        <div className='card-modal-container'>
          <div className='card-modal-content'>  
          </div>
          {console.log('Card:',card)}
        </div>
      </Modal>
    </>
  )
}

export default React.memo(viewCard)
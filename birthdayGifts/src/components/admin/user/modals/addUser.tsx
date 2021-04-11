import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from "react-redux";

import { Modal, Button,Form,
    Input,
    Select,
} from "antd";
import AvatarInput from '../../../modals/components/avatarInput';
import axios from 'axios'
import {withAuth} from '../../../../context/helper'
import { SIGNUP } from 'common/apiEndpoints';


 const addUser = ({fetching}) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
  
    const {currentUser} = useSelector((state) => state.userReducer);
    const {authority,userId} = currentUser

    const [form] = Form.useForm();
    
    const router = useRouter();

    const showModal = () => {
        withAuth(setIsModalVisible(true))
    };

    const refreshData = () => {
        router.replace(router.asPath);
        fetching()
    }

    const AvatarValue = (avatar) =>{
        form.setFieldsValue({['avatar']:avatar})
    }

    const handleCancel = () => {
        setIsModalVisible(false);
        setConfirmLoading(false);
        form.resetFields();
    };
    

    const onCreate = (values) => { 
        setConfirmLoading(true);
        const data = {...values,currentUserId:userId}
  
        axios({
            url:SIGNUP,
            data,
            method:'post',
            validateStatus: (status) =>{
                return true
            }
        }).then(res=>{
            if (res.status===201) {
                setIsModalVisible(false);
                setConfirmLoading(false);
                form.resetFields();
                refreshData();
            }else{
                setConfirmLoading(false);
            }
        }).catch(e=>{
            console.log('Error:',e)
        })
        
    };

    const onOk = () => {
        form
          .validateFields()
          .then((values) => {
             onCreate(values);
          })
          .catch((info) => {
            console.log('Form errors', info);
          });
    }

    const options =()=>{
        console.log('AUTHORITY:',authority)
        const superAdminOptions  = [
            {label:'REGULAR',value:"REGULAR"},
            {label:'ADMIN',value:"ADMIN"},
            {label:'SUPER ADMIN',value:"SUPER_ADMIN"}
        ]
        const adminOptions = [
            {label:'REGULAR',value:"REGULAR"},
            {label:'ADMIN',value:"ADMIN"},
        ]

        if(authority==='ADMIN'){
            return adminOptions
        }else if(authority==='SUPPER_ADMIN'){
            return superAdminOptions
        }
    }
      
  return (
    <>
      <Button type="primary" onClick={showModal}>Add a user</Button>
      <Modal confirmLoading={confirmLoading} visible={isModalVisible} onOk={onOk} onCancel={handleCancel} width={670} title={'Create new user'}>
        <div className='user-modal-container'>
          <div className='user-modal-content'>
            <Form
            className={'user-form'}
            labelCol={{
                span: 4,
            }}
            wrapperCol={{
                span: 14,
            }}
            layout="horizontal"
            size='middle'
            form={form}
            name="register"

            >
                <Form.Item
                    name="userName"
                    label={'Username'}
                    rules={[{ required: true, message: 'Please input your Username !'}]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    name="email"
                    label="E-mail"
                    rules={[
                    {
                        type: 'email',
                        message: 'The input is not valid E-mail!',
                    },
                    {
                        required: true,
                        message: 'Please input your E-mail!',
                    },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your password!',
                    },
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item 
                    label="Role" 
                    name="role" 
                    rules={[
                        { required: true, message: 'Please select an account role!' },
                    ]}>
                    <Select  options={options()} />
                </Form.Item>
                <Form.Item
                    name="avatar"
                    label={'Avatar'}
                >
                    <AvatarInput getAvatarValue={AvatarValue}/>
                </Form.Item>
            </Form>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default React.memo(addUser)

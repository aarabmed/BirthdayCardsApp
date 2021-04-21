import React, { useState,useEffect,useRef } from 'react';
import { useSelector } from "react-redux";
import axios from 'axios';
import isAuth from 'common/isAuthenticated'
import useSWR,{mutate} from "swr"

import { Modal, Button,Form,
  Input,
  Switch,
} from "antd";
import { parseCookies } from 'nookies';
import { TAGS } from 'common/apiEndpoints';

  

  type tagType ={
    key?:string,
    name:string,
    slug:string,
    status?:boolean,
  }

  type Props ={
    item?:tagType,
    mode:'add'|'edit',
    runMutate?:()=>Promise<any>
  } 


const axiosHeader = ()=>{
  const {token} = parseCookies()
  const config = {
      headers: { Authorization: `Bearer ${token}` }
  };
  return config
}


const axiosInstance = axios.create({
  validateStatus: function (status)
  {
      return true
  }
});


const addTag:React.FC<Props> =({item,mode,runMutate}) => {

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const {currentUser} = useSelector((state) => state.userReducer);
  const {userId} = currentUser

  const [form] = Form.useForm();
  const refForm = useRef(null)

  //========================================================================


  
  const showModal = () => {
      isAuth(()=>setIsModalVisible(true))
  };

  

  const  refreshTagData = () => {
        runMutate()
  }
 


  const handleOk = () => {
    isAuth(()=>{
      form
      .validateFields()
      .then((values) => {
        mode==='add'?onCreate(values):onUpdate(values);
      })
      .catch((info) => {
        console.log('Form errors', info);
      })
    
    })
  };



  const handleCancel = () => {
    setIsModalVisible(false);
    setConfirmLoading(false);
    form.resetFields();
  };

  const onCreate = (values:tagType) => { 
        setConfirmLoading(true);
        const newValues = {...values,currentUserId:userId}
      
        axiosInstance.post(
          `${TAGS}/new`,
          newValues,
          axiosHeader(),
        ).then(res=>{
            if (res.status===201) {
                setTimeout(() => {
                  setIsModalVisible(false);
                  setConfirmLoading(false);
                  form.resetFields();
                }, 1000);
                refreshTagData();
            }else{
                setConfirmLoading(false);
            }
        }).catch(e=>{
            console.log('Error:',e)
        })
  };



  const onUpdate =(values:tagType)=>{

      setConfirmLoading(true);

      axiosInstance.patch(
        `${TAGS}/${item.key}`,
        values,
        axiosHeader(),
      ).then(res=>{

        if (res.status===201) {
              
              setTimeout(() => {
                setIsModalVisible(false);
                mutate(TAGS);
                setConfirmLoading(false);
              }, 1000);

          }else{
              setConfirmLoading(false);
          }
      }).catch(e=>{
          console.log('Error:',e)
      })
  }





  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 6,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 14,
      },
    },
  };

  const TagForm = () =>{
    useEffect(()=>{
      if(item){
            if(refForm.current && !confirmLoading){
                    const {name,slug,status} = item;
                    form.setFieldsValue({status,slug:slug,name})
            }
      }
    
    },[refForm.current])

    return (<Form
                className={'addTag-form'}
                {...formItemLayout}
                layout="horizontal"
                size='middle'
                form={form}
                ref={refForm}
                name="registerCategoryType"
                >
                          <Form.Item
                            name="name"
                            label={'Name'}
                            rules={[{ required: true, message: 'the name is required'}]}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            name="slug"
                            label="Slug"
                            rules={[
                            {
                                required: true,
                                message: 'the slug is required',
                            },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        {mode==='edit'&&(
                          <Form.Item
                          name="status"
                          label={'Status'}
                          valuePropName="checked"
                          initialValue={true}
                          >
                            <Switch
                              checkedChildren={'active'}
                              unCheckedChildren={'inactive'}
                            />
                          </Form.Item>
                        )}  
              </Form>
  )}

  return (
    <>
      {mode==='add'?<Button type="primary" onClick={showModal}>Add a Tag</Button>:<a onClick={showModal}>edit</a>}
      <Modal confirmLoading={confirmLoading} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} width={520} title={`${mode==='edit'? 'Edit tag: '+item.name:'Create a new tag'}`}>
        <div className='category-modal-container'>
          <div className='modal-content'>
            <TagForm />
          </div>
        </div>
      </Modal>
    </>
  );
}
export default React.memo(addTag)

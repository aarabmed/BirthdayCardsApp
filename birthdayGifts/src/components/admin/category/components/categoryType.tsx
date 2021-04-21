import React, { useState,useEffect,useRef } from 'react';
import { useSelector } from "react-redux";
import FormData from 'form-data';
import axios from 'axios';
import useSWR,{mutate} from "swr"
import ImageUpload from '../../../modals/components/uploadImage'
import isAuth from 'common/isAuthenticated'

import { Modal, Button,Form,
  Input,
  Select,
  Switch,
  Spin
} from "antd";
import { parseCookies } from 'nookies';
import { CATEGORIES, SUB_CATEGORIES, SUB_CATEGORIES_CHILD, TAGS } from 'common/apiEndpoints';

  

  type Obj = {
    _id:string,
    name:string
  }

  type Img = {
    path:string
  }
  type categoryType ={
    key?:string,
    name:string,
    description:string,
    slug:string,
    status:boolean,
    image:File & Img,
    tags?:[Obj],
    subCategory?:[Obj],
    childrenSubCategory?:[Obj]
  }

  type Props ={
    item?:categoryType,
    type:string,
    mode:'add'|'edit',
    runMutate?:()=>Promise<any>
  } 




const requestData =  (url:string) =>{
  const {token} = parseCookies()
  const config = {
      headers: { Authorization: `Bearer ${token}` }
  };
  const fetcher = url => axios.get(url,config).then(res => res.data)

  const {data,error} =  useSWR(url, fetcher)
  return {data,error}
}


const CategoryType:React.FC<Props> =({item,type,mode,runMutate}) => {
  const fetcher = url => axios.get(url,axiosHeader()).then(res => res.data)

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [imgUrl, setimgUrl] = useState('');

  const {currentUser} = useSelector((state) => state.userReducer);
  const {userId} = currentUser

  const [form] = Form.useForm();
  const refForm = useRef(null)

  //========================================================================
  
  const getUrl = ()=>{
    if(type==='category'){
      return CATEGORIES
    }else if(type==='sub-category'){
      return SUB_CATEGORIES
    }else{
      return SUB_CATEGORIES_CHILD
    }
  }

  const axiosHeader = ()=>{
    const {token} = parseCookies()
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    return config
  } 

  
  const showModal = () => {
      isAuth(()=>setIsModalVisible(true))
  };

  


  const  refreshData = () => {
        runMutate()
  }

  

  const getImage =(img:File)=>{
      form.setFieldsValue({['image']:img})
  }

  const savedImage = (imgUrl)=>{
      setimgUrl(imgUrl)
  }



  const handleOk =  () => {
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
    setimgUrl('')
    form.resetFields();
  };

  const onCreate = (values:categoryType) => { 
      setConfirmLoading(true);
      const url = getUrl()
      let formData = new FormData();
        formData.append('name',values.name);
        formData.append('slug',values.slug);
        formData.append('description',values.description);
        formData.append('currentUserId',userId);
        formData.append('status',values.status);
      if(type==='category'){
        formData.append('categoryImage',values.image);
        const newSubCategory = values.subCategory?JSON.stringify(values.subCategory):undefined
        formData.append('subCategory',newSubCategory);
      }

      if(type==='sub-category'){
        formData.append('subCategoryImage',values.image);
        formData.append('tags',JSON.stringify(values.tags));
        formData.append('subChildren',JSON.stringify(values.childrenSubCategory));
      }
      if(type==='sub-category-child'){
        formData.append('subCategoryChildImage',values.image);
        formData.append('tags',JSON.stringify(values.tags));
      }
      

      
      
      const axiosInstance = axios.create({
        validateStatus: function (status)
        {
            return true
        }
      });
         axiosInstance.post(
          `${url}/new`,
          formData,
          axiosHeader(),
        ).then(res=>{
            if (res.status===201) {
                setTimeout(() => {
                  setIsModalVisible(false);
                  setConfirmLoading(false);
                  setimgUrl('')
                  form.resetFields();
                }, 1000);
                refreshData();
            }else{
                setConfirmLoading(false);
            }
        }).catch(e=>{
            console.log('Error:',e)
        })
  };

  const onUpdate =(values:categoryType)=>{
      const url = getUrl()
      setConfirmLoading(true);
      let formData = new FormData();
      formData.append('name',values.name);
      formData.append('slug',values.slug);
      formData.append('description',values.description);
      formData.append('currentUserId',userId);
      formData.append('status',values.status);
    if(type==='category'){
      formData.append('categoryImage',values.image);
      values.subCategory?formData.append('subCategory',JSON.stringify(values.subCategory)):null;
    }

    if(type==='sub-category'){
      formData.append('subCategoryImage',values.image);
      values.tags?formData.append('tags',JSON.stringify(values.tags)):null;
      values.childrenSubCategory?formData.append('subChildren',JSON.stringify(values.childrenSubCategory)):null;
    }
    if(type==='sub-category-child'){
      formData.append('subCategoryChildImage',values.image);
      values.tags?formData.append('tags',JSON.stringify(values.tags)):null;
    }

    const axiosInstance = axios.create({
      validateStatus: function (status)
      {
          return true
      }
    });


      axiosInstance.patch(
        `${url}/${item.key}`,
        formData,
        axiosHeader(),
      ).then(res=>{

          if (res.status===201) {
              
              setTimeout(() => {
                setIsModalVisible(false);
                mutate(url)
                setConfirmLoading(false);
                setimgUrl('')
                form.resetFields();
              }, 1000);
          }else{
              setConfirmLoading(false);
          }

      }).catch(e=>{
          console.log('Error:',e)
      })
  }
  


 
 
  const ComponentType = ({type}) =>{
    switch (type) {
      case 'category':
        return <CategoryForm/>
      case 'sub-category':
        return <SubCategoryForm/>
      case 'sub-category-child':
        return <SubCategoryChildForm/>
      default:
        <div>form does not exist</div>;
    }
  }
 


  const CategoryForm:React.FC= ()=>{
    //const [loading, setLoading] = useState(true)
    let SubCategoiresOptions = []
    const response = useSWR(SUB_CATEGORIES, fetcher)

    SubCategoiresOptions = response.data.data.map(e=>({label:e.name,value:e._id}))
    let subCategoryInitial = mode === 'edit'? SubCategoiresOptions.filter(e=>item.subCategory.some(sub=>sub._id===e.value)).map(e=>e.value) : [];
    /* if(loading){
      setLoading(false)
    } */
    useEffect(()=>{

      if(item){
        const {name,slug,description,status,image} = item;
        if(refForm.current && !confirmLoading){
          form.setFieldsValue({status,slug,name,image,description,subCategory:subCategoryInitial})
        }
      }
    },[refForm.current])

  


    return(
      <Form
      className={'addCategory-form'}
      {...formItemLayout}
      layout="horizontal"
      size='middle'
      form={form}
      ref={refForm}
      name="registerCategoryType"
      >
            <div className='categoryImage'>
                <Form.Item 
                  name="image" 
                  >
                  <ImageUpload uploadedImage={getImage}  oldImage={item?item.image.path:''} />
      
                </Form.Item>
            </div>
            <div className='categoryFormInputs'>
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
              <Form.Item
                  name="description"
                  label={'Description'}
                  rules={[{ required: true, message: 'the description is required'}]}
              >
                  <Input/>
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
              <Form.Item 
                  name="subCategory" 
                  label="Sub-category" 
                  rules={[{type:'array'}]}
                  >
                  <Select mode="multiple" options={SubCategoiresOptions}  />
              </Form.Item>
          </div>
    </Form>
  )
  }



  const SubCategoryForm:React.FC = ()=>{
   
    const [loadingTag, setLoadingTag] = useState(true)
    const [loadingSubCat, setLoadingSubCat] = useState(true)

    let tagsOptions = [];
    let subChildrenOpitons = [];
    let tagsInitialValues = [];
    let subChildrenInitialValues= [];


      const responseTag =  requestData(TAGS)

      if(responseTag.data) {
        tagsOptions = responseTag.data.data.map(e=>({label:e.name,value:e._id}))
        mode === 'edit' ? tagsInitialValues = tagsOptions.filter(e=>item.tags.some(tag=>tag.name===e.label)).map(e=>e.value):[]
        if(loadingTag){
          setLoadingTag(false)
        }
      }

      const responseSubChild = requestData(SUB_CATEGORIES_CHILD)

      if(responseSubChild.data){
        subChildrenOpitons = responseSubChild.data.data.map(e=>({label:e.name,value:e._id}))
        mode === 'edit' ? subChildrenInitialValues = subChildrenOpitons.filter(e=>item.childrenSubCategory.some(sub=>sub.name===e.label)).map(e=>e.value):[]
        if(loadingSubCat){
          setLoadingSubCat(false)
        }
      } 
     
      

    useEffect(()=>{
     if(item){
      const {name,slug,description,status,image} = item;
      if(refForm.current&&!loadingTag&&!loadingSubCat&&!confirmLoading){
        form.setFieldsValue({status,slug,name,image,description,childrenSubCategory:subChildrenInitialValues,tags:tagsInitialValues})
      }
     }
    },[refForm.current])

  return(
      <Form
            className={'addCategory-form'}
            {...formItemLayout}
            layout="horizontal"
            size='middle'
            form={form}
            ref={refForm}
            name="register-sub-category"
            
            >
                    <div className='categoryImage'>
                        <Form.Item 
                          name="image" 
                          >
                    
                          <ImageUpload uploadedImage={getImage} mode={mode} oldImage={item?item.image.path:''} />
                        </Form.Item>
                    </div>
                    <div className='categoryFormInputs'>
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
                      <Form.Item
                          name="description"
                          label={'Description'}
                          rules={[{ required: true, message: 'the description is required'}]}
                      >
                          <Input/>
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
                      <Form.Item
                          name="childrenSubCategory"
                          label="Sub-children"
                          rules={[{type:'array'}]}
                      >
                          <Select mode='multiple' options={subChildrenOpitons} loading={loadingSubCat} />
                      </Form.Item>
                      <Form.Item 
                          name="tags" 
                          label="tags" 
                          rules={[{type:'array'}]}
                          >
                          <Select mode='multiple' options={tagsOptions} loading={loadingTag} />
                      </Form.Item>
                  </div>
      </Form>
  )
  }  
  



  
  const SubCategoryChildForm:React.FC = ()=>{
    const responseTag = requestData(TAGS)
    const[ loading , setLoading] = useState(true)

    let tagsOptions = [];
    let tagsInitialValues = [];

    if(responseTag.data) {
      tagsOptions = responseTag.data.data.map(e=>({label:e.name,value:e._id}))
      mode === 'edit'? tagsInitialValues = tagsOptions.filter(e=>item.tags.some(tag=>tag.name===e.label)).map(e=>e.value):[]
      if(loading){
        setLoading(false)
      }
    }

    

    useEffect(()=>{
      if(item){
        const {name,slug,description,status,image} = item;
        if(refForm.current && !confirmLoading){
          form.setFieldsValue({status,slug,name,image,description})
          form.setFieldsValue({tags:tagsInitialValues})
        }
      }
    },[refForm.current])

    
    return(
      <Form
            className={'addCategory-form'}
            {...formItemLayout}
            layout="horizontal"
            size='middle'
            form={form}
            name="register-sun-category-child"
           // initialValues={{tags:tagsInitialValues}}
            ref={refForm}
            >
                    <div className='categoryImage'>
                        <Form.Item 
                          name="image" 
                          >
                    
                          <ImageUpload uploadedImage={getImage} oldImage={item?item.image.path:''} />
              
                        </Form.Item>
                    </div>
                    <div className='categoryFormInputs'>
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
                      <Form.Item
                          name="description"
                          label={'Description'}
                          rules={[{ required: true, message: 'the description is required'}]}
                      >
                          <Input/>
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
                      <Form.Item 
                          name="tags" 
                          label="Tags" 
                          rules={[{type:'array'}]}
                          
                          >
                          <Select mode='multiple' options={tagsOptions} loading={loading}/>
                      </Form.Item>
                  </div>
      </Form>
  )
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


  return (
    <>
      {mode==='add'?<Button type="primary" onClick={showModal}>Add a {type==='sub-category-chlid'?'sub-category chlid':type}</Button>:<a onClick={showModal}>edit</a>}
      <Modal confirmLoading={confirmLoading} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} width={820}>
        <div className='category-modal-container'>
          <div className='modal-content'>
              <ComponentType type={type} />
          </div>
        </div>
      </Modal>
    </>
  );
}
export default React.memo(CategoryType)

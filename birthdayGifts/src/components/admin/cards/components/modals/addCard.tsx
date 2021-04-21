import React, { useState,useEffect,useRef } from 'react';
import { useSelector } from "react-redux";
import FormData from 'form-data';
import axios from 'axios';
import useSWR,{mutate} from "swr"
import ImageUpload from 'components/modals/components/uploadImage'
import isAuth from 'common/isAuthenticated'

import { Modal, Button,Form,
  Input,
  Select,
  Divider
} from "antd";
import { parseCookies } from 'nookies';
import { CARDS, CATEGORIES, SUB_CATEGORIES, TAGS } from 'common/apiEndpoints';
import { PlusOutlined } from '@ant-design/icons';

  

  type Obj = {
    _id:string,
    name:string
  }

  type cardType ={
    key?:string,
    title:string,
    description:string,
    slug:string,
    status:boolean,
    cardSize:string
    image:File|string,
    tags?:[Obj],
    category?:[Obj],
    subCategory?:[Obj],
    subCategoryChild?:[Obj]
  }

 
  type Props = {
    runMutate?:()=>Promise<any>
  } 





const axiosHeader = (value?)=>{
  const {token} = parseCookies()
  const config = {
      headers: { Authorization: `Bearer ${token}` },
      params:value
  };
  return config
}

const CardType:React.FC<Props> =({runMutate}) => {

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [imgUrl, setimgUrl] = useState('');

  const {currentUser} = useSelector((state) => state.userReducer);
  const {userId} = currentUser

  
  const fetcher = (url,params?) => axios.get(url,axiosHeader(params)).then(res => res.data)
  const [tag, setTag] = useState('')
  const [newTags, setNewTags] = useState([])
  const [subCategoryOptions, setSubCategoryOptions] = useState([])
  const [subCategoryChildOptions, setSubCategoryChildOptions] = useState([])
  const [categoryLoading, setCategoryLoading] = useState(true)
  const [subCategoryLoading, setSubCategoryLoading] = useState(true)
  const [subChildLoading, setSubChildLoading] = useState(true)
  const [tagsLoading, setTagsLoading] = useState(false)

  let categoryOptions = []
  let tagsOptions = []

  const {data:categoryData,error:categoryError} =  useSWR(()=>CATEGORIES, fetcher)
  const {data:tagsData,error:tagsError} =  useSWR(()=>TAGS, fetcher)

  const [form] = Form.useForm();

  if(categoryData) {
    categoryOptions = categoryData.data.map(e=>({label:e.name,value:e._id}))
    if(categoryLoading){
      setCategoryLoading(false)
    }
  }

  if(tagsData) {
    tagsOptions = tagsData.data.map(e=>({label:e.name,value:e._id}))
    if(tagsLoading){
      setTagsLoading(false)
    }
  }
  
  

  const axiosInstance = axios.create({
    validateStatus: function (status)
    {
        return true
    }
  });

  //========================================================================
  


  const categoryOnChange = async () =>{
    const category = form.getFieldValue('category')
    if(category){
      form.setFieldsValue({['subCategory']:''})
      form.setFieldsValue({['subCategoryChild']:''})
      const data = await fetcher(CATEGORIES+'/'+category)
      const subCategories = data.res.subCategory.map(e=>({label:e.name,value:e._id}))
      setSubCategoryOptions(subCategories)
      setSubCategoryLoading(false)
    }
  }


  const subCategoryOnChange = async () =>{
    const subCategory = form.getFieldValue('subCategory')
    if(subCategory){
      form.setFieldsValue({['subCategoryChild']:''})
      const data = await fetcher(SUB_CATEGORIES+'/'+subCategory)
      const subCategoryChild = data.res.childrenSubCategory.map(e=>({label:e.name,value:e._id}))
      setSubCategoryChildOptions(subCategoryChild)
      setSubChildLoading(false)
    }
  }
  


  const showModal = () => {
      isAuth(()=>setIsModalVisible(true))
  };

  


  const  refreshData =()=> {
      runMutate()
  }

  

  const getImage =(img:File)=>{
      form.setFieldsValue({['image']:img})
  }

  const savedImage = (imgUrl)=>{
      setimgUrl(imgUrl)
  }



  const handleOk = () => {
    isAuth(()=>{
      form
      .validateFields()
      .then((values) => {
         onCreate(values);
      })
      .catch((info) => {
        console.log('Form errors', info);
    });
    })
  };



  const handleCancel = () => {
    setIsModalVisible(false);
    setConfirmLoading(false);
    setimgUrl('')
    setSubCategoryOptions([]);
    setSubCategoryChildOptions([]);
    setNewTags([])
    form.resetFields();
  };

  const onCreate = async (values:cardType) => { 
      setConfirmLoading(true);
      let tags = []
      let formData = new FormData();
        formData.append('title',values.title);
        formData.append('slug',values.slug);
        formData.append('description',values.description);
        formData.append('currentUserId',userId);
        formData.append('cardImage',values.image);
        formData.append('cardSize',values.cardSize);
        formData.append('category',values.category);
        formData.append('subCategory',values.subCategory);
        formData.append('subCategoryChild',values.subCategoryChild);
        
      const newTagsChecked = values.tags.filter(tag=>newTags.some(e=>tag===e.value))
      const existedTagsChecked = values.tags.filter(tag=>!newTags.some(e=>tag===e.value))
      tags=existedTagsChecked
      
      if(newTagsChecked.length){
        const {data,status} = await axiosInstance.post(`${TAGS}/multiple/new`,{tags:newTagsChecked},axiosHeader())
        const tagsIds = status===201?data.res.map(e=>e._id):null  
        tags = [...tags,...tagsIds]
      }
      formData.append('tags',tags?JSON.stringify(tags):undefined);
      axiosInstance.post(
      `${CARDS}/new`,
      formData,
      axiosHeader(),
        ).then(res=>{
            console.log('RES:::',res)
            if (res.status===201) {
                setTimeout(() => {
                  handleCancel()
                }, 1000);
                refreshData();
            }else{
                setConfirmLoading(false);
            }
        }).catch(e=>{
            console.log('Error:',e)
      })
  };

    

  const onTagChange =(e)=>{
    const newtag = e.target.value
    setTag(newtag)
  }

  const addNewTag = () => {
    const newTag = {label:tag,value:tag}
    setNewTags([...newTags,newTag])
    setTag('')
  };  



  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 8,
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

  const cardSizeOptions = [
    {label:'3.5" x 5"',value:'3.5" x 5"'},
    {label:'5" x 7"',value:'5" x 7"'},
    {label:'4.5" x 5.75"',value:'4.5" x 5.75"'},
    {label:'5.5" x 8.5"',value:'5.5" x 8.5"'},
  ]


  return (
    <>
      <Button type="primary" onClick={showModal}>Add a card</Button>
      <Modal confirmLoading={confirmLoading} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} width={900}>
        <div className='category-modal-container'>
          <div className='modal-content'>
                <Form
                    className={'addCardForm'}
                    {...formItemLayout}
                    layout="horizontal"
                    size='middle'
                    form={form}
                    name="register-card"
                    >
                    <div className='cardImage'>
                        <Form.Item 
                          name="image" 
                          >
                    
                          <ImageUpload uploadedImage={getImage} storedImage={savedImage} />
              
                        </Form.Item>
                    </div>
                    <div className='cardFormInputs'>
                        <Form.Item
                          name="title"
                          label={'Title'}
                          rules={[{ required: true, message: 'a title is required'}]}
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
                      <Form.Item 
                          name="cardSize" 
                          label="Card size" 
                          rules={[{type:'string',required:true,message: 'the card size is required'}]}
                          
                          >
                          <Select options={cardSizeOptions}/>
                      </Form.Item>
                      <Form.Item 
                          name="category" 
                          label="Category" 
                          rules={[{type:'string',required:true,message: 'a Category is required'}]}
                          
                          >
                          <Select  options={categoryOptions} loading={categoryLoading} onChange={categoryOnChange}/>
                      </Form.Item>
                      <Form.Item 
                          name="subCategory" 
                          label="Sub-Category" 
                          rules={[{type:'string'}]}
                          
                          >
                          <Select options={subCategoryOptions} loading={subCategoryLoading} onChange={subCategoryOnChange}/>
                      </Form.Item>
                      <Form.Item 
                          name="subCategoryChild" 
                          label="Sub-Category-children" 
                          rules={[{type:'string'}]}
                          >
                          <Select options={subCategoryChildOptions} loading={subChildLoading} />
                      </Form.Item>
                      <Form.Item 
                          name="tags" 
                          label="Tags" 
                          rules={[{type:'array'}]}
                          
                          >
                          <Select mode='multiple' options={[...tagsOptions,...newTags]} loading={tagsLoading} dropdownRender={
                            menu=>(
                              <>
                                {menu}
                                <Divider style={{margin:'4px 0'}}/>
                                <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                                  <Input style={{ flex: 'auto' }} value={tag} onChange={onTagChange} />
                                  <a
                                    style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                                    onClick={addNewTag}
                                  >
                                    <PlusOutlined /> Add a tag
                                  </a>
                                </div>
                              </>
                            )
                          }/>
                      </Form.Item>
                  </div>
                </Form>
          </div>
        </div>
      </Modal>
    </>
  );
}
export default React.memo(CardType)

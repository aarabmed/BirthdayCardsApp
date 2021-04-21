import React, { useState,useEffect,useRef, useImperativeHandle, forwardRef } from 'react';
import { useSelector } from "react-redux";
import FormData from 'form-data';
import axios from 'axios';
import useSWR,{mutate} from "swr"
import ImageUpload from 'components/modals/components/uploadImage'
import isAuth from 'common/isAuthenticated'

import { Modal, Button,Form,
  Input,
  Select,
  Switch,
  Spin,
  Divider,
  PageHeader,
  Tag
} from "antd";
import { parseCookies } from 'nookies';
import { CARDS, CATEGORIES, SUB_CATEGORIES, SUB_CATEGORIES_CHILD, TAGS } from 'common/apiEndpoints';
import { PlusOutlined } from '@ant-design/icons';
import { User } from 'pages/admin/login';
import DeleteCard, { deleteProps } from 'components/modals/removeItem'

  

  type Obj = {
    _id:string,
    name:string
  }

  type Img = {
    path:string,
  }

  

  export type cardType ={
    _id?:string,
    title:string,
    description:string,
    slug:string,
    status:boolean,
    cardSize:string[],
    createdBy:User,
    imageFile?:File,
    image:Img,
    tags?:Obj[],
    category?:Obj,
    subCategory?:Obj,
    subCategoryChild?:Obj
  }


  
 

  type Props = {
    runMutate?:()=>Promise<any>,
    item?:cardType,
    refresh:()=>void
  } 

  export type ModalProps = {
    openModal: () => void,
  }



const axiosHeader = (value?)=>{
  const {token} = parseCookies()
  const config = {
      headers: { Authorization: `Bearer ${token}` },
      params:value
  };
  return config
}






const ViewCard:React.ForwardRefRenderFunction<ModalProps,Props> =({item,runMutate,refresh},ref) => {

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isFooter, setIsFooter] = useState(false);

  const {currentUser} = useSelector((state) => state.userReducer);
  const {userId} = currentUser

  
  const fetcher = (url,params?) => axios.get(url,axiosHeader(params)).then(res => res.data)
  const [tag, setTag] = useState('')
  const [newTags, setNewTags] = useState([])
  const [subCategoryOptions, setSubCategoryOptions] = useState([])
  const [subCategoryChildOptions, setSubCategoryChildOptions] = useState([])
  const [categoryLoading, setCategoryLoading] = useState(true)
  const [subCategoryLoading, setSubCategoryLoading] = useState(false)
  const [subChildLoading, setSubChildLoading] = useState(false)
  const [tagsLoading, setTagsLoading] = useState(false)
  const [isEdidtMode, setIsEdidtMode] = useState(false)
  const [category, setCategory] = useState('')
  const [subCategory, setSubCategory] = useState('')
  const [selectedCard, setSelectedCard] = useState({status:false,slug:'',cardSize:'',title:'',image:{},description:'',tags:[],category:'',subCategory:'',subCategoryChild:''});




  let cardSizeInitial =''
  let categoryInitial =''
  let subCategoryInitial =''
  let subCategoryChildInitial=''

  let categoryOptions = []
  let tagsInitial = []
  let tagsOptions = []

  const cardSizeOptions = [
    {label:'3.5" x 5"',value:'3.5" x 5"'},
    {label:'5" x 7"',value:'5" x 7"'},
    {label:'4.5" x 5.75"',value:'4.5" x 5.75"'},
    {label:'5.5" x 8.5"',value:'5.5" x 8.5"'},
  ]

  const {data:categoryData,error:categoryError} =  useSWR(()=>CATEGORIES, fetcher)


  const {data:tagsData,error:tagsError} =  useSWR(()=>TAGS, fetcher)


  const refForm = useRef(null)
  const [form] = Form.useForm();


 
  if(categoryData) {

    categoryOptions = categoryData?.data.map(e=>({label:e.name,value:e._id}))
    categoryInitial = categoryOptions?.filter(e=>item.category?._id===e.value).map(e=>e.value)[0];

    cardSizeInitial = cardSizeOptions?.filter(card=>card.value===item?.cardSize[0]).map(e=>e.value)[0];
    
    if(categoryLoading){
      setCategoryLoading(false)
    }
  }

  if(tagsData) {
    tagsOptions = tagsData?.data.map(e=>({label:e.name,value:e._id}))
    tagsInitial = item?.tags.length?tagsOptions?.filter(e=>item?.tags?.some(sub=>sub._id===e.value)).map(e=>e.value):[];

    if(tagsLoading){
      setTagsLoading(false)
    }
  }
  


  useEffect(()=>{
    
    const {title,slug,description,status,image} = item;    
    tagsOptions=[...tagsOptions,...newTags]

    if(refForm.current){
      if(isModalVisible){
            fetcher(CATEGORIES+'/'+item.category._id).then(async (data)=>{
            const subCategories = data.res.subCategory? data.res.subCategory.map(e=>({label:e.name,value:e._id})):[]
            setSubCategoryOptions(subCategories)
            subCategoryInitial = item.subCategory?._id?item.subCategory?._id:'';

            if(item.subCategory._id){

              const {res} = await fetcher(SUB_CATEGORIES+'/'+item.subCategory._id)
              const subCategoryChild = res.childrenSubCategory? res.childrenSubCategory.map(e=>({label:e.name,value:e._id})):[]
              setSubCategoryChildOptions(subCategoryChild)
              subCategoryChildInitial = item.subCategoryChild?._id?item.subCategoryChild?._id:'';
            
            }
            const result = {
              status:status,
              slug:slug,
              cardSize:cardSizeInitial,
              title:title,
              image:image,
              description:description,
              category:categoryInitial,
              tags:tagsInitial,
              subCategory:subCategoryInitial,
              subCategoryChild:subCategoryChildInitial,
            }
            setSelectedCard(result)
          })
        }
    }
    
    
    },[newTags,isModalVisible])

  

  const axiosInstance = axios.create({
    validateStatus: function (status)
    {
        return true
    }
  });

  //========================================================================
  


  const categoryOnChange = async () =>{
    const newCategory  = form.getFieldValue('category')

    if(category !== newCategory){
      form.setFieldsValue({['subCategory']:''})
      form.setFieldsValue({['subCategoryChild']:''})
      setSubCategory('')
      setSubCategoryChildOptions([])
      setCategory(newCategory)
      
      const data = await fetcher(CATEGORIES+'/'+newCategory)
      const subCategories = data.res.subCategory.map(e=>({label:e.name,value:e._id}))
      setSubCategoryOptions(subCategories)
    }
  }


  const subCategoryOnChange = async () =>{
    const newSubCategory = form.getFieldValue('subCategory')

    if(subCategory!==newSubCategory){
      form.setFieldsValue({['subCategoryChild']:''})
      setSubCategory(newSubCategory)
      const data = await fetcher(SUB_CATEGORIES+'/'+newSubCategory)
      const subCategoryChild = data.res.childrenSubCategory.map(e=>({label:e.name,value:e._id}))
      setSubCategoryChildOptions(subCategoryChild)
    }
  }
  
  const showModal =() => {
      isAuth(()=>setIsModalVisible(true))
  };

  useImperativeHandle(ref, () => ({
     openModal(){
       showModal()
     }
  }));


  const  refreshData =()=> {
      runMutate()
  }

  const refreshCards = () =>{
    refresh()
  }


  const getImage =(img:File)=>{
      form.setFieldsValue({['imageFile']:img})
  }


  const handleOk =() => {
    isAuth(()=>{
        form
        .validateFields()
        .then((values) => {
            onUpdate(values)        
        })
        .catch((info) => {
          console.log('Form errors', info);
        });
      }
    )
  };



  const handleCancel = () => {
    setIsModalVisible(false);
    setConfirmLoading(false);
    setSubCategoryOptions([]);
    setSubCategoryChildOptions([]);
    setNewTags([])
    setIsEdidtMode(false)
    setIsFooter(false)
    refForm.current? form.resetFields() : null;
  };

  const onUpdate = (values:cardType) => { 
    isAuth(async ()=>{
      setConfirmLoading(true);
      let tags = []
      let formData = new FormData();
        formData.append('title',values.title);
        formData.append('slug',values.slug);
        formData.append('description',values.description);
        formData.append('currentUserId',userId);
        values.imageFile?formData.append('cardImage',values.imageFile):null;
        formData.append('cardSize',values.cardSize);
        formData.append('status',values.status);
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
      axiosInstance.patch(
      `${CARDS}/${item._id}`,
      formData,
      axiosHeader(),
        ).then(res=>{

          if (res.status===201) {
                refreshData();
                setConfirmLoading(false);
                setIsFooter(false)
                setIsEdidtMode(false)
            }else{
                setConfirmLoading(false);
            }

        }).catch(e=>{
            console.log('Error:',e)
      })
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

  const onEditCard=()=>{
      setIsFooter(true)
      setIsEdidtMode(true)
  }

  const onDismiss=()=>{
      setIsFooter(false)
      setIsEdidtMode(false)
      setimgUrl('')
  }


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

  

  const EditForm=()=>{

  return(<div className='modal-content'>
                <Form
                    className={'addCardForm'}
                    {...formItemLayout}
                    layout="horizontal"
                    size='middle'
                    form={form}
                    name="register-card"
                    ref={refForm}
                    initialValues={selectedCard}
                    >
                    <div className='cardImage'>
                        <Form.Item 
                          name="imageFile" 
                          >
                            
                          <ImageUpload uploadedImage={getImage} oldImage={item?item.image.path:''} />
              
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
                      <Form.Item
                        name="status"
                        label={'Status'}
                        valuePropName="checked"
                        //initialValue={true}
                        >
                          <Switch
                            checkedChildren={'active'}
                            unCheckedChildren={'inactive'}
                          />
                        </Form.Item>
                  </div>
                </Form>
          </div>
  )}

  const View = ()=>(
 
          <div className="card-container">
              <div
                className='cardImage'
              >
                <img alt="example" src={`/${item.image.path}`} />
              </div>
              <div className='card-items'>
                <ul>
                  <li><span className='inline-input'>Name:</span><span className='item-value'>{item.title}</span></li>
                  <li><span className='inline-input'>Slug:</span><span className='item-value'>{item.slug}</span></li>
                  <li><span className='inline-input'>Card size:</span><span className='item-value'>{item.cardSize[0]}</span></li>
                  <li><span className='inline-input'>Status:</span><span className='item-value'><Tag color={item.status? 'green':'red'}>{item.status?'Active' : 'Inactive'}</Tag></span></li>
                  <li><span className='inline-input'>Created By:</span><span className='item-value'>{item.createdBy.userName}</span></li>
                  <li><span className='inline-input'>Category:</span><span className='item-value'>{item.category.name}</span></li>
                  <li><span className='inline-input'>Sub category:</span><span className='item-value'>{item.subCategory.name||<span className='no-data'>no data associated</span>}</span></li>
                  <li><span className='inline-input'>Sub category child:</span><span className='item-value'>{item.subCategoryChild.name||<span className='no-data'>no data associated</span>}</span></li>
                  <li><span className='block-input'>Description:</span><span className='item-value'>{item?.description}</span></li>
                  <li><span className='block-input'>Tags:</span>
                    <span className='item-value'>
                      {item.tags.length?item.tags.map((item)=>(<Tag color="magenta" key={item._id}>{item.name}</Tag>)):<span className='no-data'>no data associated</span>}
                    </span></li>
                </ul>
              </div>
          </div>

  )

  const footer = [
      <Button key="back" >
        Return
      </Button>,
      <Button key="submit" type="primary"  loading={confirmLoading} onClick={handleOk}>
        Submit
      </Button>,
  ]


  const propsDelete:deleteProps={
    itemId:item._id,
    type:'Card',
    targetUrl:CARDS,
    itemName:item.title,
    button:"regular",
  }

  return (
    <>
      <Modal confirmLoading={confirmLoading} visible={isModalVisible} onCancel={handleCancel} width={900} footer={isFooter&&footer}>
        <PageHeader
            ghost={false}
            subTitle={'Card ID: '+ item._id}
            extra={[
              <DeleteCard onDelete={handleCancel} doRefrech={refreshCards} {...propsDelete} key='454'/>,
              !isFooter?<Button key="1" type="primary"  onClick={onEditCard}>Edit</Button>:<Button key="2" danger onClick={onDismiss}>Dismiss</Button>,
            ]}
          >
          </PageHeader>
        {isEdidtMode?<EditForm/>:<View/>}
      </Modal>
    </>
  );
}

const View = forwardRef(ViewCard);
export default React.memo(View)

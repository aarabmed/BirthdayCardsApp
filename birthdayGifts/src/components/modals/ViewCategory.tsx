import React, { useState } from 'react';
import {Tag, Modal, Divider} from "antd";
import redirectToLogin from 'common/redirectToLogin'
import checkAuth from 'common/auth'

  type category ={
    name:React.ReactChild,
    slug:React.ReactChild,
    status:React.ReactChild,
    createdAt:React.ReactChild,
    lastUpdate:React.ReactChild,
    tags?:[React.ReactChild],
    subCategory?:[React.ReactChild],
    childrenSubCategory?:[React.ReactChild]
  }
const ModalView = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState({});

  const showModal = async () => {
    const isAuth = await checkAuth()
    if(isAuth){
      setIsModalVisible(true);
      convert(props);
      return
    }
    redirectToLogin()
    
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };



  const handleCancel = () => {
    setIsModalVisible(false);
    setData({})
  };


  const convert =({type,record})=>{
    const value = record;
    let newObject:category = {
      name:<span>{value.name}</span>,
      slug:<span>{value.slug}</span>,
      status:<Tag color={value.status? 'green':'red'}>{value.status?'Active' : 'Inactive'}</Tag>,
      createdAt:<span>{value.createdAt}</span>,
      lastUpdate:<span>{value.updatedAt}</span>,
    }

    if(type==='category'){
      newObject = {
        ...newObject,
        tags:value.tags.length?[value.tags.map((item,index)=>(<Tag color="magenta" key={index}>{item}</Tag>))]:[<span key='111'>no tag associated</span>],
        subCategory:value.subCategory.length?[value.subCategory.map((item,index)=>(<Tag color="blue" key={index}>{item}</Tag>))]:[<span key='111'>no sub-category associated</span>]
      }
    }
    if(type==='subCategory'){
      newObject = {
        ...newObject,  
        tags:value.tags.length?[value.tags.map((item,index)=>(<Tag color="magenta" key={index}>{item}</Tag>))]:[<span key='111'>no tag associated</span>],   
        childrenSubCategory:value.childrenSubCategory.length?[value.childrenSubCategory.map((item,index)=>(<Tag color="success" key={index}>{item}</Tag>))]:[<span key='111'>no sub-items associated</span>],
      }
    }

    setData(newObject);
  }


 
 
  const title = (value) =>{
    switch (value) {
      case 'lastUpdate':
        return 'Last Update'
      case 'createdAt':
        return 'Created At'
      case 'slug':
        return 'Slug'
      case 'status':
        return 'Status'
      case 'subCategory':
          return 'Sub-Categories'
      case 'children':
        return 'Sub-Category-items'
      case 'tags':
        return 'Tags'
      case 'title':
        return 'Title'
      case 'name':
        return 'Name'
      default:
        break;
    }
  }
  const {record,name} = props
  return (
    <>
      <a onClick={showModal}>{name}</a>
      <Modal visible={isModalVisible} onCancel={handleCancel} footer={null} width={820}>
        <div className='category-modal-container'>
          <div
            className='categoryImage'
          >
            <img alt="example" src={`/${record.image}`} />
          </div>
          <div className='modal-content'>
                {
                  Object.keys(data).map((e,index)=>{ 
                    if(data[e]){
                      return(
                          <div key={index} className='mc-main'>
                            <Divider orientation="left">{title(e)}</Divider>
                            <div className='mc-sub-main'>
                              {data[e]}
                            </div>
                          </div>
                        )
                      }
                  })
                } 
          </div>
        </div>
      </Modal>
    </>
  );
}

export default React.memo(ModalView)

import React, { useState } from 'react';
import {Tag, Modal, Divider} from "antd";
import isAuth from 'common/isAuthenticated'

  type category ={
    name:React.ReactChild,
    slug:React.ReactChild,
    status:React.ReactChild,
    createdAt:React.ReactChild,
    lastUpdate:React.ReactChild,
    subCategory?:[React.ReactChild],
    childrenSubCategory?:[React.ReactChild]
  }
const ModalView = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState({});

  const showModal = () => {
     isAuth(()=>{
      setIsModalVisible(true) 
      convert(props)
     })
  };


  const handleCancel = () => {
    setIsModalVisible(false);
    setData({})
  };


  const convert =({type,record})=>{
    const value = record;
    let newObject:category = {
      name:<span key='1'>{value.name}</span>,
      slug:<span>{value.slug}</span>,
      createdAt:<span>{value.createdAt}</span>,
      lastUpdate:<span>{value.updatedAt}</span>,
      status:<Tag color={value.status? 'green':'red'}>{value.status?'Active' : 'Inactive'}</Tag>,
    }
    if(type==='category'){
      newObject = {
        ...newObject,
        createdAt:null,
        subCategory:value.subCategory.length?[value.subCategory.map((item)=>(<Tag color="blue" key={item._id}>{item.name}</Tag>))]:[<span key='111'>no sub-category associated</span>],
        childrenSubCategory:value.childrenSubCategory.length?[value.childrenSubCategory.map((item)=>(<Tag color="success" key={item._id}>{item.name}</Tag>))]:[<span key='111'>no sub-items associated</span>],
      }
    }
    if(type==='subCategory'){
      newObject = {
        ...newObject,  
        childrenSubCategory:value.childrenSubCategory.length?[value.childrenSubCategory.map((item)=>(<Tag color="success" key={item._id}>{item.name}</Tag>))]:[<span key='111'>no sub-items associated</span>],
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
      case 'childrenSubCategory':
        return 'Sub-Category-items'
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
            <img alt="example" src={`/${record.image.path}`} />
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

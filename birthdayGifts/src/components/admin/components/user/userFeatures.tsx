import React ,{useState} from "react";
import { useSelector } from "react-redux";

import Icon from '@ant-design/icons';
import { Button, Menu, Dropdown, Modal} from "antd";
import {mutate} from "swr"
import axios from 'axios'

import { parseCookies } from "nookies";
import { USERS } from "common/apiEndpoints";
import Icons from 'assets/icons'
import DeleteComponent from 'components/modals/removeItem'

const axiosHeader = ()=>{
  const {token} = parseCookies()
  const config = {
      headers: { Authorization: `Bearer ${token}` }
  };
  return config
}




const userFeatures = ({userInfo,refreachData,goBack}) =>{
      const [featuresFormVisible, setFeaturesFormVisible] = useState(false)
      const [featureType, setFeatureType] = useState(undefined)
      const [newUserFeature, setNewUserFeature] = useState(undefined)
      const [confirmLoading, setConfirmLoading] = useState(false)
      const [message, setMessage] = useState('');
      const [isUpdated, setIsUpdated] = useState(false);
      const {currentUser} = useSelector((state) => state.userReducer);
      const { authority } = currentUser;
      const { SubMenu} = Menu;

      const SuccussIcon  = ()=> <Icon component={Icons.successIcon} />
      const FailIcon  = ()=> <Icon component={Icons.failIcon} />
      const BackIcon =()=><Icon component={Icons.backIcon} />

      const onFeatureChange = ({key})=>{
        setFeatureType(key)
      }
  

      const features = ({key})=>{
        setNewUserFeature(key)
        setFeaturesFormVisible(true)
      }

      const onSubmitFeature=(target,id,data)=>{
        const axiosInstance = axios.create({
          validateStatus: function (status)
          {
              return true
          }
        });

        
           axiosInstance.patch(
            `${USERS}/${target}/${id}`,
            data,
            axiosHeader(),
          ).then(res=>{
            console.log('Cat-res:',res)
              if (res.status===200) { 
                  mutate(USERS)
                  refreachData()
                  setTimeout(() => {
                    setConfirmLoading(false);
                    setMessage(res.data.message)
                    setIsUpdated(true)
                  }, 1000);
              }else{
                  setConfirmLoading(false);
                  setIsUpdated(false)
                  setMessage(res.data.message)
              }
          }).catch(e=>{
              console.log('Error:',e)
          })
      }
      

      const onFeaturesOk = () => {
        setConfirmLoading(true);
        if(featureType==='Upgrading'){
          const data = {
            role:newUserFeature,
            currentUserId:currentUser.userId,
          }
          onSubmitFeature('upgrade',userInfo.key??userInfo._id,data)
        }
        if(featureType==='Downgrading'){
          const data = {
            role:newUserFeature,
            currentUserId:currentUser.userId,
          }
          onSubmitFeature('downgrade',userInfo.key??userInfo._id,data)
        }
        if(featureType==='Status'){
          const data = {
            status:newUserFeature,
            currentUserId:currentUser.userId,
          }
          onSubmitFeature('status',userInfo.key??userInfo._id,data)
        }
      };
        
    
      const onDeleteItem =()=>{
        goBack()
      }


      const onFeatureCancel = () => {
        setFeaturesFormVisible(false);
        setNewUserFeature(undefined)
      };


      const withProps = isUpdated ? {
        footer:null
      }:{}

      const deleteProps = {
        itemId:userInfo.key,
        type:'User',
        targetUrl:USERS,
        itemName:userInfo.userName,
      }

      const menu =(
        <Menu onClick={features} triggerSubMenuAction='click'>
          {(userInfo.authority==='REGULAR'&&authority==='SUPER_ADMIN')&&<SubMenu onTitleClick={onFeatureChange} key='Upgrading' title="Promote">
                  <Menu.Item key='SUPER_ADMIN'>SUPER ADMIN</Menu.Item>
                  <Menu.Item key='ADMIN'>ADMIN</Menu.Item>
          </SubMenu>}
          {(userInfo.authority==='REGULAR'&&authority==='ADMIN')&&<SubMenu onTitleClick={onFeatureChange} key='Upgrading' title="Promote">
                  <Menu.Item key='ADMIN'>ADMIN</Menu.Item>
          </SubMenu>}
          {(userInfo.authority==='ADMIN'&&authority==='SUPER_ADMIN')&&<SubMenu onTitleClick={onFeatureChange} key='Upgrading' title="Promote">
                  <Menu.Item key='SUPER_ADMIN'>SUPER ADMIN</Menu.Item>
          </SubMenu>}
          {(userInfo.authority==='ADMIN'&&authority==='SUPER_ADMIN')&&<SubMenu onTitleClick={onFeatureChange} key='Downgrading' title="Demote">
                  <Menu.Item key='REGULAR'>REGULAR</Menu.Item>
          </SubMenu>
          
          }
          {(userInfo.authority!==authority||userInfo.authority==='REGULAR')&&<SubMenu onTitleClick={onFeatureChange} key='Status' title="Status">
              {userInfo.status?<Menu.Item key='false'>Disable</Menu.Item>:<Menu.Item key='true'>Enable</Menu.Item>}
          </SubMenu>} 
        </Menu>
      );

      const ModalContent = ()=>{
        if(featureType==='Status'){
          const title = newUserFeature === 'true'?'Enabling':'Disabling'
          return <div className="warning-modal-container">
                  <h4>Are you sure of {title} this user ? </h4>
                  <p> Name : <span >{userInfo.userName}</span></p> 
                  <p> Current status : <span > {userInfo.status?'Active':'Inactive'}</span></p>
                </div>
        }else{
          return <div className="warning-modal-container">
                  <h4>Are you sure of {featureType} this user to {newUserFeature}? </h4>
                  <p> Name : <span >{userInfo.userName}</span></p> 
                  <p> Current Rank : <span > {userInfo.authority}</span></p>
                </div>
        }
      }

      return<>
            <Button key="3333" onClick={goBack}><BackIcon/>Back</Button>
            {((authority!=='REGULAR')&&(userInfo.authority!==authority)&&(userInfo.authority!=='SUPER_ADMIN'))&&(<><Dropdown overlay={menu} placement='bottomCenter' trigger={['click']} key='22222'>
              <Button >Actions</Button>
            </Dropdown>
            <DeleteComponent onDelete={onDeleteItem} {...deleteProps} button='regular' key='1564842' /></>)},      
            <Modal
                key='1248752'
                title="Title"
                visible={featuresFormVisible}
                onOk={onFeaturesOk}
                confirmLoading={confirmLoading}
                onCancel={onFeatureCancel}
                cancelText='Return'
                width={400}
                okText = {message?'Try again':'Confirm'}
                {...withProps}
                >
                {!message?<ModalContent/>:<div className='warrningModal'>
                      {isUpdated?<SuccussIcon/>:<FailIcon/>}<span> {message}</span>
                  </div>
                }
            </Modal>
          </>
    
} 

export default React.memo(userFeatures)

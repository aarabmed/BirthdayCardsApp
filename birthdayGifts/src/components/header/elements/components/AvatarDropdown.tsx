
import React from 'react';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin,Dropdown } from 'antd';
import Router,{ useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import {removeUser} from "@/redux/actions/userActions";

const  AvatarDropdown=()=>{
  const {currentUser} = useSelector((state) => state.userReducer);
  const {avatar,userName} = currentUser
  const dispatch = useDispatch();
  const router = useRouter()

    const onMenuClick = (event) => {
      const { key } = event;
  
      if (key === 'logout') {
        dispatch(removeUser())
        router.push('login')
        return;
      }
    };
  
    const menuHeaderDropdown =()=> (
        <Menu className='avatarDropdownMenu' onClick={onMenuClick}>
            <Menu.Item key="center">
              <UserOutlined />
              Profil
            </Menu.Item>
    
            <Menu.Item key="settings">
              <SettingOutlined />
              Settings
            </Menu.Item>
  
            <Menu.Item key="logout">
              <LogoutOutlined />
              Log out
            </Menu.Item>
        </Menu>
    );
      
      return (
        <Dropdown trigger={['click']} overlay={menuHeaderDropdown}>
          <span className={`avatarDropdown`}>
             <Avatar size="small" className='avatar-header' src={process.env.PUBLIC_URL + avatar } alt="avatar" />
             <span>{userName}</span>
          </span>
        </Dropdown>
      ) 
}

export default AvatarDropdown
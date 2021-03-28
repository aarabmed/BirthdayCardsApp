
import React, { useState, useEffect } from 'react';
import Icon,{ LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import Language from 'assets/icons'
import { Avatar, Menu, Spin } from 'antd';


const { SubMenu } = Menu;

const FrenchIcon =()=> <Icon component={Language.franceIcon} />;
const ArabicIcon =()=>  <Icon component={Language.arabicIcon}/>
const EnglishIcon =()=> <Icon component={Language.englishIcon} />;

const  SelectLang =()=>{
  const [lang, setLang] = useState('Ar');
  const [subMenuIcon, setSubMenuIcon] = useState(ArabicIcon);

    const onMenuClick = (event) => {
      const { key } = event;
      switch (key) {
        case 'Fr':
          setLang('Fr')
          setSubMenuIcon(FrenchIcon)
          break;
        case 'Ar':
            setLang('Ar')
            setSubMenuIcon(ArabicIcon)
            break;
        default:
          setLang('En')
          setSubMenuIcon(EnglishIcon)
          break;
      }
    };



  
      
      return (
        <Menu mode="horizontal" className='languageMenu' selectedKeys={[lang]} onClick={onMenuClick}> 
          <SubMenu key="SubMenu"  title={lang} className='SubMenuLang'>
            <Menu.Item key="Ar" >
               <ArabicIcon  /> 
               Arabic
            </Menu.Item>
    
            <Menu.Item key="Fr" >
              <FrenchIcon />
              French
            </Menu.Item>
    
            <Menu.Item key="En" >
                <EnglishIcon />
              English
            </Menu.Item>
          </SubMenu>
        </Menu>
      ) 
}

export default SelectLang
import React, { useState } from 'react';
import {PageHeader,Tag, Modal, Divider, Button} from "antd";
import redirectToLogin from 'common/redirectToLogin'
import checkAuth from 'common/auth'

type User ={
}

const viewUser:React.FC=() => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState({});

  const showModal = async () => {
    const isAuth = await checkAuth()
    if(isAuth){
      setIsModalVisible(true)
      return
    }
    redirectToLogin()
    
  };

/*   const handleOk = () => {
    setIsModalVisible(false);
  };



  const handleCancel = () => {
    setIsModalVisible(false);
    setData({})
  };
 */

 
  return (
    <>
        <div className='viewUser'>
          <div className='viewUser-header'>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title="Title"
                subTitle="This is a subtitle"
                extra={[
                    <Button key="3">Operation</Button>,
                    <Button key="2">Operation</Button>,
                    <Button key="1" type="primary">Primary</Button>,
                ]}
            >
                <p>
                    Ant Design interprets the color system into two levels: a system-level color system and a product-level color system.
                </p>
                <p>
                    Ant Design's design team preferred to design with the HSB color model, which makes it easier for designers to have a clear psychological expectation of color when adjusting colors, as well as facilitate communication in teams.
                </p>
            </PageHeader>
          </div>
          <div className='viewUser-content'>
                
          </div>
        </div>
    </>
  );
}

export default viewUser

import React from "react";
import { Tag,PageHeader, Descriptions, Empty, Divider} from "antd";
import moment from "moment";
import Features from "./userFeatures"


const Header =({userInfo,refreachData,toUsersList})=>{
    const color = userInfo.status? 'green':'volcano'
    let tag = userInfo.status?'Active' : 'Inactive'
    
   return <>
      <PageHeader
        className="user-page-header"
        //onBack={goBack}
        title=""
        subTitle="User informations:"
        extra={[
          <Features userInfo={userInfo} refreachData={refreachData} goBack={toUsersList} key='1234578'/>
        ]}
      >
        <Descriptions size="small" column={3}>
        <Descriptions.Item label="User name">{userInfo.userName}</Descriptions.Item>
        <Descriptions.Item label="Status"><Tag color={color} key={tag}> {tag.toUpperCase()}</Tag></Descriptions.Item>
        <Descriptions.Item label="Rank">{userInfo.authority}</Descriptions.Item>
        <Descriptions.Item label="Creadted:">{moment(userInfo.createdAt).format('DD MMM YYYY')}</Descriptions.Item>
        <Descriptions.Item label="E-mail">{userInfo.email}</Descriptions.Item>
        </Descriptions>
      </PageHeader>
      <div className='user-page-data'>
          <Divider orientation="left" plain>User data:</Divider>
          <Empty />
      </div>
    </>
}

export default React.memo(Header)

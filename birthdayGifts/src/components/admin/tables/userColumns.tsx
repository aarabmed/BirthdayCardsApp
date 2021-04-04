import { PropertySafetyFilled } from "@ant-design/icons";
import {Tag, Space} from "antd";
import { ColumnsType } from "antd/lib/table";

export const userCol = (callBack)=>{
      const userColumns:ColumnsType = [
        {
          title: 'UserName',
          dataIndex: 'userName',
          key: 'username',
          fixed: 'left',
          width:'15%',
          render: text => <a>{text}</a>,
        },
        {
          title: 'Email',
          dataIndex: 'email',
          key: 'email',
        },
        {
          title: 'Authority',
          dataIndex: 'authority',
          key: 'authority',
        },
        {
          title: 'Status',
          key: 'status',
          dataIndex: 'status',
          width:120,
          render: status =>  
            {
                let color = status? 'green':'volcano'
                let tag = status?'Active' : 'Inactive'
                return (
                  <Tag color={color} key={tag}>
                    {tag.toUpperCase()}
                  </Tag>
                );
            }
        },
        {
          title: 'Action',
          key: 'action',
          fixed: 'right',
          render: (text,record) => {
            console.log('RECORD:',record)
            return(
            <Space size="middle" >
              <a onClick={()=>callBack(record)}>view</a>
            </Space>
          )}
        },
      ];

      return userColumns

}
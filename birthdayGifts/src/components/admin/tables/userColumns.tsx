import {Tag, Space} from "antd";
import { ColumnsType } from "antd/lib/table";

export const userColumns:ColumnsType = [
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
          render: status => (
            <>
              {status.map(elm => {
                let color = elm? 'green':'volcano'
                let tag = elm?'Active' : 'Inactive'
                return (
                  <Tag color={color} key={tag}>
                    {tag.toUpperCase()}
                  </Tag>
                );
              })}
            </>
          ),
        },
        {
          title: 'Action',
          key: 'action',
          fixed: 'right',
          render: (text, record) => (
            <Space size="middle">
              <a>Edit</a>
              <a>Delete</a>
            </Space>
          ),
        },
      ];

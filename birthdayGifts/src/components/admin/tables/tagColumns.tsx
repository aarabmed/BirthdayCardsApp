import {Tag, Space} from "antd";

export const tagColumns = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          render: text => <a>{text}</a>,
        },
        {
          title: 'Slug',
          dataIndex: 'slug',
          key: 'slug',
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
            title: 'Date created',
            dataIndex: 'createdAt',
            key: 'createdAt',
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

import ModalView from '@/components/modals/ViewCategory'
import {Tag, Space} from "antd";

  export const categoryColumns = [
    {
      title: 'Category',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>,
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
     // responsive: ['md'],
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      //responsive: ['md'],
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
       // responsive: ['md'],
    },
    {
      title: 'Action',
      key: 'action',
      //fixed: 'right',
      render: (text, record) => (
        <Space size="middle">
          <ModalView name='More' record={record}  type='category' />
          <a>Edit</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  export const subCategoryColumns = [
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
      title: 'date Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <ModalView name='More' record={record} type='subCategory' />
          <a>Edit</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  export const childrenColumns = [
    {
      title: 'Item name',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>,
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      //render: text => <a>{text}</a>,
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
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
      title: 'date Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        
        <Space size="middle">
          <ModalView name='More' record={record} type='subCategoryItems' />
          <a>Edit</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];

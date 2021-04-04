import ModalView from 'components/modals/viewCategory'
import EditCategory from 'components/modals/Category'
import DeleteComponent, { deleteProps } from 'components/modals/removeItem'
import {CATEGORIES,SUB_CATEGORIES_CHILD,SUB_CATEGORIES} from 'common/apiEndpoints'
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
      render: status => {
        let color = status? 'green':'volcano'
        let tag = status?'Active' : 'Inactive'
        return (
        <>
          <Tag color={color} key={tag}>
            {tag.toUpperCase()}
          </Tag>
        </>
        )
      },
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
      fixed: 'right' as const,
      render: (text, record) => {
        const item:deleteProps = {
          type:'Category',
          targetUrl: CATEGORIES,
          itemId:record.key,
          itemName:record.name,
          button:'link'
        }
        return(
          <Space size="middle">
            <ModalView name='More' record={record}  type='category' />
            <EditCategory type='category' item={record} mode='edit'/>
            <DeleteComponent {...item} />
          </Space>
        )
      }
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
      render: status => {
        let color = status? 'green':'volcano'
        let tag = status?'Active' : 'Inactive'
        return (
        <>
          <Tag color={color} key={tag}>
            {tag.toUpperCase()}
          </Tag>
        </>
        )
      },
    },
    {
      title: 'date Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right' as const,
      render: (text, record) =>{
        const item:deleteProps = {
          type:'Sub-category',
          targetUrl: SUB_CATEGORIES,
          itemId:record.key,
          itemName:record.name,
          button:'link'
        }
        return(
        <Space size="middle">
          <ModalView name='More' record={record} type='subCategory' />
          <EditCategory type='sub-category' item={record} mode='edit'/>
          <DeleteComponent {...item}/>
        </Space>
        )
      }
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
      render: status => {
        let color = status? 'green':'volcano'
        let tag = status?'Active' : 'Inactive'
        return (
        <>
          <Tag color={color} key={tag}>
            {tag.toUpperCase()}
          </Tag>
        </>
        )
      },
    },
    {
      title: 'date Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right' as const,
      render: (text, record) => {
        const item:deleteProps = {
          type:'Sub-category child',
          targetUrl: SUB_CATEGORIES_CHILD,
          itemId:record.key,
          itemName:record.name,
          button:'link'
        }
        return (
        <Space size="middle">
          <ModalView name='More' record={record} type='subCategoryItems' />
          <EditCategory type='sub-category-child' item={record} mode='edit'/>
          <DeleteComponent {...item}/>
        </Space>
        )
      }
    },
  ];

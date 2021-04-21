import {Tag, Space} from "antd";
import EditTag from "components/admin/tag/components/tagType";
import DeleteTag, { deleteProps } from 'components/modals/removeItem'
import { TAGS } from "common/apiEndpoints";
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
          render: status => {
              let color = status ? 'green':'volcano';
              let tag = status ? 'Active' : 'Inactive'
            return(
                  <Tag color={color} key={tag}>
                    {tag.toUpperCase()}
                  </Tag>
              );
          }
        },
        {
            title: 'Date created',
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
        {
          title: 'Action',
          key: 'action',
          fixed: 'right' as const,
          width: 120,
          render: (text, record) => {
          const props:deleteProps = {
            itemId:record.key,
            targetUrl:TAGS,
            itemName:record.name,
            type: 'Tag',
            button: 'link'
          }
          return(
            <Space size="middle">
              <EditTag mode='edit' item={record} />
              <DeleteTag {...props}/>
            </Space>
          )}
        },
      ];

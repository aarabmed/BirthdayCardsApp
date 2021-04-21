

import * as React from "react";
import Icon, { NodeIndexOutlined } from '@ant-design/icons';
import { ThenableArgument } from 'antd/lib/message';
import Icons from 'assets/icons' 
import { ExtendsProps } from "@ant-design/pro-form/lib/BaseForm/createField";
import { cardType } from "./modals/viewCard";
import { deleteProps } from "components/modals/removeItem";
import { CARDS } from "common/apiEndpoints";
import DeleteCard from 'components/modals/removeItem'

interface CardProps {
    cover:string,
    removeButton?:boolean,
    afterRemove?:()=>void,
    onClick?:(item:cardType)=>void,
    item?:cardType
}

const defaultProps: CardProps = {
    cover: '',
    removeButton: true,
}

interface BodyProps  {
    title:string,
    description?:string
}

interface CardSubComponents {
    Body: React.FunctionComponent<BodyProps>;
}

 const Body:React.FC<BodyProps>=({title,description})=>{
    return (
     <div className='bc-card-body'>
             <div className='bc-card-content'>
                 <span className='bc-card-body-title'>{title}</span>
                 <span className='bc-card-body-description'>{description}</span>
             </div>
     </div>
 )} 

const RemoveIcon = ()=><Icon component={Icons.removeIcon} />

const Index:React.FC<CardProps> & CardSubComponents =({item,cover,onClick,afterRemove,removeButton,children})=>{    
    const propsDelete:deleteProps={
        itemId:item._id,
        type:'Card',
        targetUrl:CARDS,
        itemName:item.title,
        doRefrech:afterRemove
    }
    
    const deleteButton  = <div className='bc-card-remove-button'>
        <RemoveIcon/><span>Remove</span>
    </div>
    return(
    <div className='bc-card'>
        <div className='bc-card-img' onClick={()=>onClick(item)}>
            <img alt='example' src={cover} />
        </div>
        {removeButton&&<DeleteCard customButton={deleteButton}  {...propsDelete} key='454'/>}
        <>
            <div onClick={()=>onClick(item)}>
                {children}
            </div>
        </>
    </div>
    )
}
Index.defaultProps=defaultProps
Index.Body = Body


export default Index

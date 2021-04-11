

import * as React from "react";
import Icon, { NodeIndexOutlined } from '@ant-design/icons';
import { ThenableArgument } from 'antd/lib/message';
import Icons from 'assets/icons' 
import { ExtendsProps } from "@ant-design/pro-form/lib/BaseForm/createField";


interface CardProps {
    cover:string,
    removeButton?:boolean,
    onRemove?:()=>void,
    onClick?:()=>void,
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

const Index:React.FC<CardProps> & CardSubComponents =({cover,onClick,onRemove,removeButton,children})=>{    

    return(
    <div className='bc-card'>
        <div className='bc-card-img' onClick={onClick}>
            <img alt='example' src={cover} />
        </div>
        {removeButton&&<div className='bc-card-remove-button' onClick={onRemove}>
            <RemoveIcon/><span>Remove</span>
        </div>}
        <>
            {children}
        </>
    </div>
    )
}
Index.defaultProps=defaultProps
Index.Body = Body


export default Index

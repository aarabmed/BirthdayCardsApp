
import React, { useState, useEffect } from 'react';
import Icon from '@ant-design/icons';

import * as AntdIcons from '@ant-design/icons';

import Icons from 'assets/icons'

interface Props {
    className?:string;
    type:string;
}

const  costumIcon:React.FC<Props>=(props)=>{ 

        const {type} = props
        const AntdIcon= AntdIcons[type];
        if(!AntdIcon){

            const Component = (props) => <Icon  component={Icons[type]} {...props}/>;
            return <Component {...props} />
        }
        
        return <AntdIcon style={{ fontSize: '20px'}} {...props}/>
        
}

export default costumIcon
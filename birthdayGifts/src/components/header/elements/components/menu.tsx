
import React from 'react';

import Router from "next/router"
import { useSelector, useDispatch } from "react-redux";
import classNames from "classnames";
import { setRoute } from "@/redux/actions/globalActions";
import CustomIcon from './customIcon'


interface routeProps {
    id:number;
    name:string;
    slug:string;
    iconName:string
}
interface Props {
    items:{
        authority?:string[];
        route?:routeProps[]
    },
    className?:string;
}

const  costumMenu:React.FC<Props> =(props)=>{ 
    const {items,className} = props
    const {route} = useSelector((state) => state.globalReducer);
    const {query} = Router
    const dispatch = useDispatch();

    const onChooseRoute = (data) => {
    Router.push(data)
    if (!data) {
        return dispatch(setRoute("dashboard"));
    }
    return dispatch(setRoute(data));
    };


    return <ul className = {className}>
            {   items.route.map((item, index) =>(
                    <li
                    key={index}
                    className={classNames({
                        active: route===''?query.page===item.slug:route===item.slug,
                    })}
                    >
                    
                        <a
                        onClick={(e) => {
                            e.preventDefault();
                            onChooseRoute(item.slug);
                        }}
                        > 
                        <CustomIcon className='menuIcon' type={item.iconName}/>
                        {item.name}
                        </a>
                    
                    </li>
                )
            )}
        </ul>
        
}

export default costumMenu
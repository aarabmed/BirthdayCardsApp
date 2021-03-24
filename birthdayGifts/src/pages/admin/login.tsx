import { AlipayCircleOutlined, TaobaoCircleOutlined, WeiboCircleOutlined } from '@ant-design/icons';
import { Alert, Checkbox } from 'antd';
import React, { useState,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import fetch from "node-fetch";
import checkAuth from '../../common/auth'
import { setCookie } from 'nookies'
import Router,{ useRouter } from "next/router";
import Spinner from "../../components/spin/spiner"

import {doesConnectionExist} from '../../common/check-internet'
import {setRoute} from "../../redux/actions/globalActions";
import {setUser} from "../../redux/actions/userActions";


import LoginFrom from '../../components/login';


const { UserName, Password, Submit } = LoginFrom;

export interface LoginParamsType {
  userName: string;
  password: string;
}

export interface StateType {
  status?:string;
  type?:string;
  currentAuthority?:'user'|'guest';
} 

export interface Data {
  userId,
  userName,
  token,
  authority,
  avatar
} 


interface Response {
  data?:Data;
  status?:number;
  message?:string;
} 

interface LoginProps {
  error?: string;
}

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC<LoginProps> = (props) => {  
  const [autoLogin, setAutoLogin] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true)

  const [errorMessage, setErrorMessage] = useState(null);
  const {route} = useSelector((state) => state.globalReducer);
  const router = useRouter()
  const dispatch = useDispatch();

 // const [type, setType] = useState<string>('account');
  useEffect(()=>{
    (async function auth(){
      const isAuth = await checkAuth() 
      const oldRoute = router.query.redirectTo?router.query.redirectTo:'dashboard'
      if(isAuth) router.push(`${oldRoute}`)
      if(!isAuth) setLoading(false)
      doesConnectionExist().then(res=>{
      })
    })()
    
  },[])



  const handleSubmit = async (values: LoginParamsType) => {
    setSubmitting(true);
    
    doesConnectionExist().then(res=>{

      if(!res){
          setSubmitting(false)
          setErrorMessage('Please make sure you are connected to the internet, then try again')
      }

    })
    
    

    const newRoute:string = route===''?'dashboard':route

    if(newRoute==='dashboard'){
      dispatch(setRoute("dashboard"))
    }

    const {status,message,data}:Response = await fetch(
      '/api/account/login',{
        method: 'POST',
        body: JSON.stringify(values),
        headers: { 'Content-Type': 'application/json' }
      }
      ).then(res=>res.json()).catch(e=>{
          setSubmitting(false);
          setErrorMessage('Error while connecting to Database, try later')
      })
      
      if(status===200){
        const user = {
          userId:data.userId,
          userName:data.userName,
          authority:data.authority,
          avatar:data.avatar
        }
        dispatch(setUser(user))
        setCookie(null, 'token', data.token, {
          maxAge: 30 * 24 * 60 * 60,
          path: '/',
          secure: false,
        })

        
        
        Router.push(newRoute)
      }else{
        setSubmitting(false);
        setErrorMessage(message);
      }
    
  };
  if(loading) return <div className='indexSpinner'><Spinner/></div>
  return (
    <div className='login-container'>
      <div className="main">
      <LoginFrom onSubmit={handleSubmit}>
        <div>
          {errorMessage&& (
            <LoginMessage content={errorMessage} />
          )}
          <UserName
            name="userName"
            placeholder="Username"
            rules={[
              {
                required: true,
                message: 'Please, type in your username',
              },
            ]}
          />
          <Password
            name="password"
            placeholder="Password"
            rules={[
              {
                required: true,
                message: 'Please, type in your password',
              },
            ]}
          />
        </div>
        <div>
          <a>
            Forgot password
          </a>
        </div>
        <Submit loading={submitting}>Submit</Submit>
      </LoginFrom>
      </div>
    </div>
    
  );
};

export const getServerSideProps = async (ctx) => {
  
  const isAuth =  await checkAuth(ctx)  
  return {
    props: {},
  };
}
export default Login

import { Form } from 'antd';
import React, { useState } from 'react';

import classNames from 'classnames';
import { FormInstance } from 'antd/es/form';


import LoginItem, { LoginItemProps } from './LoginItem';
import LoginSubmit from './LoginSubmit';

export interface LoginParamsType {
  userName: string;
  password: string;
}

export interface LoginProps {
  style?: React.CSSProperties;
  onSubmit?: (values: LoginParamsType) => void;
  className?: string;
  from?: FormInstance;
}

interface LoginType extends React.FC<LoginProps> {
  Submit: typeof LoginSubmit;
  UserName: React.FunctionComponent<LoginItemProps>;
  Password: React.FunctionComponent<LoginItemProps>;
}

const Login: LoginType = (props) => {
  const { className } = props;
  return (
    <div className={classNames(className, 'login')}>
        <Form
          form={props.from}
          onFinish={(values) => {
            if (props.onSubmit) {
              props.onSubmit(values as LoginParamsType);
            }
          }}>
        {props.children}
        </Form>
      </div>
  );
};


Login.Submit = LoginSubmit;

Login.UserName = LoginItem.UserName;
Login.Password = LoginItem.Password;


export default Login;

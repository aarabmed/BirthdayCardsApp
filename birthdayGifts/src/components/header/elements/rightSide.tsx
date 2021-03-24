import React, { useState, useEffect } from "react";
import { Select, Button, AutoComplete,Drawer } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import SelectLang from './components/SelectLang'
import Avatar from './components/AvatarDropdown'


function RightSide() {
  return (
    <>
      <div className="head-rightSide">
          <SelectLang/>
          <Avatar />
      </div>
    </>
  );
}

export default React.memo(RightSide);

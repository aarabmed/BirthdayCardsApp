import React from "react";

import LeftHeader from "./elements/leftSide";
import RightHeader from "./elements/rightSide";

function Header({mobileMenu}) {

  return (
    <div className='header'>
          <LeftHeader mobileMenu={mobileMenu}/>
          <RightHeader/>
    </div>
  );
}

export default React.memo(Header);

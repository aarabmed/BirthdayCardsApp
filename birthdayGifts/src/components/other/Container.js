import React from "react";

export default function Container({ type, children, cName }) {
  const renderContainerType = (type) => {
    switch (type) {
      case "fluid":
        return "container-fluid";
      default:
        return "container";
    }
  };
  let newContainer = renderContainerType(type) ;
  if(cName){
    return <div className={newContainer.concat(cName)}>{children}</div>;
  }
  return <div className={newContainer}>{children}</div>;
}

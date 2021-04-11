import { Spin} from "antd";
import { LoadingOutlined } from '@ant-design/icons';


const Spinner=()=>{
    const antIcon = <LoadingOutlined style={{ fontSize: 50 , color:'#fb5231'}} spin />;
    
    return (
        <div className={'spinner'}><Spin indicator={antIcon}/></div>
    );
  } 
  
  export default Spinner

import React, { useEffect, useState } from 'react'
import { Upload, message } from 'antd';
import { EditOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';


type Props ={
    storedImage?:(e:string)=>void,
    uploadedImage:(e:Object)=>void,
    oldImage?:string,
    mode?:string,
};


function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt1M = file.size / 1024 / 1024 < 1;
  if (!isLt1M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt1M;
}

const UploadImage:React.FC<Props>=({uploadedImage,oldImage})=>{
    const [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imageUrl,setImageUrl] = useState('')
  

    useEffect(()=>{
      if(oldImage&&!imageUrl){
          setImageUrl('/'+oldImage)
          console.log('oldImg',oldImage,'-newImg:')
      }
    },[imageUrl])

    const showEdit =()=>{
        setEdit(true)
    }
    const hideEdit =()=>{
        setEdit(false)
    }
    const handleChange = info => {
        if (info.file.status === 'uploading') {
          setLoading(true)
        return;
        }
        if (info.file.status === 'done') {

          // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl =>{
            uploadedImage(info.file.originFileObj)
            //storedImage(imageUrl)
            setImageUrl(imageUrl);
            setLoading(false)
        });

            
        
      };
    }

    const uploadButton = (
      <div className="uploadButton">
        <div className="upload">
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
      </div>
    );

    return (
      <Upload
        name="Image uploader"
        listType="picture-card"
        className="image-uploader"
        showUploadList={false}
        action=""
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {imageUrl ? <div className='imagePreview' onMouseEnter={showEdit} onMouseLeave={hideEdit}>{edit&&<span><EditOutlined /> Change image </span>}<img src={`${imageUrl}`} alt="avatar" style={{ width: '100%' }} /></div> : uploadButton}
      </Upload>
    );
}

export default React.memo(UploadImage)

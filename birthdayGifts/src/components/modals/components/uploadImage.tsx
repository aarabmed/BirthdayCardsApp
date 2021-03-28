import React from 'react'
import { Upload, message } from 'antd';
import { EditOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';


type Props ={
    storedImage:(e:string)=>void,
    uploadedImage?:(e:Object)=>void,
    image?:{
      newImg:string,
      oldImg:string|File
    },
    mode:string
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

class uploadImage extends React.Component<Props>{
    constructor(props: Props) {
        super(props)
    }
    state = {
        loading: false,
        imageUrl: this.props.image.newImg?this.props.image.newImg:`/${this.props.image.oldImg}`,
        edit:false
    };
  

    showEdit =()=>{
        this.setState({edit:true})
    }
    hideEdit =()=>{
        this.setState({edit:false})
    }
    handleChange = info => {
        if (info.file.status === 'uploading') {
        this.setState({ loading: true });
        return;
        }
        if (info.file.status === 'done') {

          // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl =>{
            this.props.uploadedImage(info.file.originFileObj)
            this.props.storedImage(imageUrl)
            this.setState({
            imageUrl,
            loading: false,
            })}
        );
            
        }
    };

  render() {
    const { loading, imageUrl,edit } = this.state;
    const { mode } = this.props;
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
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
        onChange={this.handleChange}
      >
        {imageUrl && mode==='edit' ? <div className='imagePreview' onMouseEnter={this.showEdit} onMouseLeave={this.hideEdit}>{edit&&<span><EditOutlined /> Change image </span>}<img src={imageUrl.toString()} alt="avatar" style={{ width: '100%' }} /></div> : uploadButton}
      </Upload>
    );
  }
}

export default uploadImage
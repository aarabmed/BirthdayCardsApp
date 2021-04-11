import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, List, Empty, Pagination, Button } from "antd";
import Icon from '@ant-design/icons';
import Icons from 'assets/icons' 
import Card from './components/bc-card'
import ViewCard from './components/modals/viewCard'
import axios from "axios";
import { parseCookies } from "nookies";
import { CARDS } from "common/apiEndpoints";
import useSWR from "swr";
import { useRouter } from "next/router";



const { Body } = Card





const p = {
    page:1,
    size:10
}
const axiosHeader = (value)=>{
  const {token} = parseCookies()
  const config = {
    headers: { Authorization: `Bearer ${token}` }, 
    params:value
  };
  return config
}


const fetcher = (url,params) => axios.get(url,axiosHeader(params)).then(res => res.data)
const swrConfig = {
    revalidateOnFocus: false,
    refreshWhenHidden: false,
    refreshInterval: 0
}

type cardProps = {
  title:string,
  slug:string,
  image:{path:string}
}

function Cards(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading,setLoading] = useState(true)
  const [size,setSize] = useState(12)
  const [pageNumber,setPageNumber] = useState(1)

  const [cardsList, setCardList] = useState([])
  const initialData = props.data
  

  //const page='1';

  const params = useMemo(()=>({pageNumber,size}),[pageNumber,size])

  const { data, error, mutate,isValidating } = useSWR([CARDS,params], fetcher,swrConfig)

  const {asPath} = useRouter()

  useEffect(()=>{
    
  },[])


  const onCardClicked =()=>{
    console.log('Function executed')
    setIsOpen(true)
  }


  

  const onCardRemoved =()=>{
    console.log('Cared Removed')
  }
  const closeModal =()=>{
    setIsOpen(false)
  }

  function onShowSizeChange(current, pageSize) {
    //console.log(current, pageSize);
    setSize(pageSize)
    mutate()
  }
  function onPageChange(page){
     setPageNumber(page)
  }

  //const newTotal = data.totalPages*size
  return (
    <div className="cards-wrapper">
      <ViewCard card='Speacial Card' isModalOpen={isOpen} closeModal={closeModal}/>
      <Button type='primary' onClick={()=>console.log('data:',data)}> re-fetch</Button>
      <div className="cards-container">
        <List
            className="cards-container"
            itemLayout='horizontal'
            pagination={{
              onChange: onPageChange,
              current:pageNumber,
              pageSize:size,
              pageSizeOptions:['12','24','48','96'],
              showSizeChanger:true,
              onShowSizeChange:onShowSizeChange,
              total:data?.totalPages*size||null
            }}
            dataSource={data?.data}
            loading={isValidating}
            renderItem={(item:cardProps) => (
              <Card
                  onClick={onCardClicked}
                  onRemove={onCardRemoved}
                  cover={'/'+item.image.path}
                >
                  <Body title={item.title} />
              </Card>
            )}
          />
      </div>
    </div>
  );
}


/* export async function getServerSideProps() {
  
  //const data = await fetcher(CARDS)
  
  return { props: { data } }
} */
export default React.memo(Cards);



            
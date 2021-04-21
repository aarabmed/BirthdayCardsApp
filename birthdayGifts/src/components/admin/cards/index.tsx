import React, { useEffect, useMemo, useRef, useState } from "react";
import { Row, Col, List, Empty, Pagination, Button, PageHeader } from "antd";
import Skeleton from '@material-ui/lab/Skeleton';
import Card from './components/bc-card'
import ViewCard, { cardType } from './components/modals/viewCard'
import axios from "axios";
import { parseCookies } from "nookies";
import { CARDS } from "common/apiEndpoints";
import useSWR from "swr";
import { useSelector, useDispatch } from "react-redux";
import { setNumberItemsPerPage,setPageNumber } from "redux/actions/cardActions";
import AddCard from './components/modals/addCard'
import isAuth from 'common/isAuthenticated'


const { Body } = Card


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


const defaultCard:cardType={
  _id:'',
  title:'',
  description:'',
  slug:'',
  status:false,
  cardSize:[''],
  createdBy:{
    userId:'',
    userName:'',
    avatar:'',
    authority:'',
    token:'',
  },
  tags:[
    {_id:'',name:'',}
  ],
  category:{_id:'',name:'',},
  subCategory:{_id:'',name:'',},
  subCategoryChild:{_id:'',name:''},
  image:{path:''}

}


function Cards(props) {
  const {pageNumber, pageSize} = useSelector((state)=> state.cardReducer)

  const [size,setSize] = useState(pageSize)
  const [page,setPageNM] = useState(pageNumber)
  const [selectedCard,setSelectedCard] = useState(defaultCard)
  const [cardsState,setCardsState] = useState([])

  const initialData = props.data

  let cards = [];

  const params = useMemo(()=>({page,size}),[page,size])

  const { data, error, mutate,isValidating } = useSWR([CARDS,params], fetcher,swrConfig)


  useEffect(()=>{
    if(data){
      cards = data.data.map(el=>(
        <Card
            key={el._id}
            item = {el}
            onClick={onCardClicked}
            afterRemove={refrechData}
            cover={'/'+el.image.path}
          >
            <Body title={el.title} />
        </Card>
      ))
      setCardsState(cards)
    }
  },[data])

  const card = useRef(null)

  const dispatch = useDispatch()


  const onCardClicked =(item:cardType)=>{
    isAuth(()=>{
      setSelectedCard({...defaultCard,...item})
      card.current.openModal()
    })
  }


  const refrechData = async ()=>{
    await mutate()
  }


  const onEditCard = async ()=>{
    const res = await mutate()

    if(res){
      const item = res.data.find(e=>e._id===selectedCard._id)
      setSelectedCard(item)
    }
  }


  

  function onShowSizeChange(current, pageSize) {
    isAuth(()=>{
      setSize(pageSize)
      dispatch(setNumberItemsPerPage(pageSize))
    })
  }

  async function onPageChange(page){
    isAuth(()=>{
      setPageNM(page)
      dispatch(setPageNumber(page))
    }) 
  }


  return (
    <div className="cards-wrapper">
      
      <div className="cards-container">
        <PageHeader
          ghost={false}
          title="Cards list"
          extra={[
            <Button key="1">Load cards</Button>,
            <AddCard  key="2"  runMutate={refrechData} />,
          ]}
        />
        <ViewCard item={selectedCard} ref={card} runMutate={onEditCard} refresh={refrechData}/> 
        <List
            className="cards-container"
            itemLayout='horizontal'
            pagination={{
              onChange:onPageChange,
              current:pageNumber,
              pageSize:size,
              pageSizeOptions:['12','24','48','96'],
              showSizeChanger:true,
              onShowSizeChange:onShowSizeChange,
              total:data?.totalPages*size||null
            }}
            children={cardsState}
            loading={cardsState.length!==data?.data.length}
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



            
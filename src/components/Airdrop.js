import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import ReactPaginate from 'react-paginate';
import Web3 from "web3";
import info from "../info.json"
import { removeDecimal, addDecimal } from '../features/web3/web3functs'
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@mui/system/Unstable_Grid'
import { useAirdropsQuery } from '../features/addAirdropApi'

export default function Airdrop() {
  const [addressList, setAddressList] = useState([]);
  const { data, error, isLoading, isSuccess } = useAirdropsQuery();

  useEffect(() => {

    async function getAirdropAdresses() {
      if (data && !isLoading) {
        console.log(data)
        try {
          //dinamik adreslerin olduğu arrayi döndüren sorgu
          let arrayOfAddresses = data.map(e => e.contract_address);
          setAddressList(arrayOfAddresses)

        } catch (err) {
          console.log(err)
        }
      }

    }
    getAirdropAdresses()
  }, [data])

  return (
    <>
      {isLoading ?
        <div className='container flex justify-center items-center mt-[100px] min-h-[400px]'>
          <div className='bg-black py-3 px-6 text-custom-yellow rounded-md'>
            Loading...

          </div>
        </div> :
        <div className='container min-h-[400px]'>
          <PaginatedItems itemsPerPage={6} addressList={addressList} />
        </div>
      }
    </>
  )
}

function getConvertBN(strBn) {
  const web3 = new Web3(info.readOnlyApi);
  let BN = web3.utils.BN;
  return new BN(strBn).toString()

}

function Items({ currentItems }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (

    <>
      <Grid container direction="row" spacing={2} xs={12} sm={12} lg={10}>
        {currentItems &&
          currentItems.map((element) => (


            <Grid key={element.key} xs={12} sm={12} md={6} className="text-custom-yellow">
              <Grid className="bg-black p-4 rounded-md hover:cursor-pointer">
                <Grid container md={12} alignItems="center" onClick={async () => {

                  navigate(element.key)
                  //window.location.href = "airdrop/" + element.key;

                }}>

                  <Grid item xs={12} sm={12} md={4}>
                    <span> Airdrop Contract Address: </span>
                  </Grid>
                  <Grid item xs={12} sm={12} md={8} className="text-sm">
                    {element.key}
                  </Grid>

                  <Grid item xs={12} sm={12} md={4}>
                    <span> Total Rewards: </span>
                  </Grid>
                  <Grid item xs={12} sm={12} md={8}>
                    {Number(element.totalRewards).toFixed(2)}
                    {"  "}
                    {element.rewardTokenSymbol}
                    {/* <img src="./models.png" className="inline-block w-[50px]" /> */}
                  </Grid>

                  <Grid item xs={12} sm={12} md={4}>
                    <span> Hold: </span>
                  </Grid>
                  <Grid item xs={12} sm={12} md={8} className="text-sm">
                    {Number(element.hold).toFixed(2)}
                    {"  "}
                    {element.holdTokenSymbol}
                    {" , GET "}
                    {Number(element.rewardAmount).toFixed(2)}
                    {"  "}
                    {element.rewardTokenSymbol}
                  </Grid>
                </Grid>
                {/* </Link> */}
              </Grid>
            </Grid>
          ))}
      </Grid>
    </>
  );
}

function PaginatedItems({ itemsPerPage, addressList }) {
  const { data, error, isLoading, isSuccess } = useAirdropsQuery();

  const [keyList, setKeyList] = useState([]);
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);



  useEffect(() => {    // 2. olarak burası calisiyor

    async function getAdresses() {
      try {

        const endOffset = itemOffset + itemsPerPage;
        let list = await getAirdropAbi(data.slice(itemOffset, endOffset))
        console.log(list)

        setCurrentItems(list);
        setPageCount(Math.ceil(data.length / itemsPerPage));

      } catch (error) {
        console.log(error)
      }
    }
    getAdresses()

  }, [itemOffset, itemsPerPage, data]);

  async function getAirdropAbi(pp) {

    const resultAddresses = pp.map((el) => {
      return {
        airdropAmount: el.length,
        rewardTokenDecimal: el.reward_token_decimal,
        rewardTokenSymbol: el.reward_token_symbol,
        minimumHold: el.minimum_hold,
        rewardAmountNotDecimal: el.single_reward,
        rewardAmount: el.single_reward,
        holdTokenDecimal: el.hold_token_decimal,
        holdTokenSymbol: el.hold_token_symbol,
        totalRewards: el.total_reward,
        hold: el.minimum_hold,
        key: el.contract_address
      }
    })
    return resultAddresses
  }

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % keyList.length;
    setItemOffset(newOffset);
  };

  return (
    <>
      {!isLoading ?

        (data.length > 0 ?
          <div className='card-content mt-28'>
            <div className='card-items-content flex flex-col md:flex-row items-start justify-start md:justify-center content-center'>
              <Items currentItems={currentItems} />
            </div>
          </div>
          :
          <div>
            "Now there is no available airdrop"
          </div>
        )
        :
        <div className='container flex justify-center items-center mt-[100px] min-h-[400px]'>
          <div className='bg-black py-3 px-6 text-custom-yellow rounded-md'>
            Loading...
          </div>
        </div>
      }

      <div className='mt-10'>
        <ReactPaginate
          breakLabel="..."
          breakClassName="btn-direction-paginate"
          previousClassName="btn-direction-paginate"
          nextClassName="btn-direction-paginate"
          nextLabel="Next >"
          onPageChange={handlePageClick}
          pageCount={pageCount}
          previousLabel="< Previous"
          renderOnZeroPageCount={null}
          className="paginate-content"
        />
      </div>
    </>
  );
}
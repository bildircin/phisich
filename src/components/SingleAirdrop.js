import React, { useEffect, useState } from 'react';
import Web3 from "web3";
import { singleAirdropAbi } from "../abi/singleAirdropAbi"
import info from "../info.json"
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import keccak256 from "keccak256";
import { addDecimal, removeDecimal } from '../features/web3/web3functs';
import MerkleTree from 'merkletreejs';
import { toast } from 'react-toastify';
import { useAirdropsQuery } from '../features/addAirdropApi'

import '../index.css'




export default function SingleAirDrop() {
    async function waitForReceipt(hash, cb) {
        web3g.web3.eth.getTransactionReceipt(hash, function (err, receipt) {
            if (err) {
                console.log(err);
            }

            if (receipt !== null) {
                // Transaction went through
                if (cb) {
                    cb(receipt);
                }
            } else {
                // Try again in 1 second
                window.setTimeout(function () {
                    waitForReceipt(hash, cb);
                }, 1000);
            }
        });
    }




    const CustomToastWithLink = (hash) => (
        <div>
            <a href={info.blockExplorer + "tx/" + hash} target='_blank'>Transaction send click to see on explorer</a>
        </div>
    );
    const colors = {
        boldFirstColor: "#FBBD17",
        boldSecondColor: "#FBBD17",
        cardBackground: "black"
    }
    const dispatch = useDispatch();
    const { web3g, pending } = useSelector((state) => state.wallet)
    const { data, error, isLoading, isSuccess } = useAirdropsQuery();
    const [currentAirdrop, setCurrentAirdrop] = useState({})
    const [addresses, setAddresses] = useState([])
    const [claimed, setClaimed] = useState(false)

    let { airdropcontractadresi } = useParams();

    const [addressExists, setAddressExists] = useState(true)
    const [inputVal, setInputVal] = useState("");
    const [buttonClaim, setButtonClaim] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const [connected, setConnected] = useState(false)
    const [airdropInfo, setAirdropInfo] = useState({
        rewardTokenAddress: "",
        holdTokenAddress: "",
        rewardTokenSymbol: "",
        holdTokenSymbol: "",
        airdropAmount: "",
        rewardAmount: "",
        minimumHold: "",
        minimumHoldWD: "",
        airdropAmountWD: "",
        rewardAmountWD: "",

    })
    useEffect(() => {
        if (web3g.connected) {
            setConnected(true)
        }
    }, [web3g])
    async function getInfo() {

        const web3 = new Web3(info.readOnlyApi);
        const airdropContract = new web3.eth.Contract(singleAirdropAbi, airdropcontractadresi);

        try {
            const token = await airdropContract.methods.token().call()
            const holdToken = await airdropContract.methods.holdToken().call()
            const getHoldTokenDecimal = await airdropContract.methods.getHoldTokenDecimal().call()
            const getRewardTokenDecimal = await airdropContract.methods.getRewardTokenDecimal().call()
            const holdTokenSymbol = await airdropContract.methods.holdTokenSymbol().call()
            const rewardTokenSymbol = await airdropContract.methods.rewardTokenSymbol().call()
            const airdropAmount = await airdropContract.methods.airdropAmount().call()
            const rewardAmount = await airdropContract.methods.rewardAmount().call()
            const minimumHold = await airdropContract.methods.minimumHold().call()


            //minimum hold decimalsiz
            const minimumHoldWD = await removeDecimal(minimumHold, getHoldTokenDecimal);

            //toplam airdrop decimalsiz
            const airdropAmountWD = await removeDecimal(airdropAmount, getRewardTokenDecimal);

            //rewardAmount decimalsiz
            const rewardAmountWD = await removeDecimal(rewardAmount, getRewardTokenDecimal);
            setAirdropInfo({
                rewardTokenAddress: token,
                holdTokenAddress: holdToken,
                rewardTokenSymbol: rewardTokenSymbol,
                holdTokenSymbol: holdTokenSymbol,
                rewardAmount: rewardAmount,
                minimumHoldWD: minimumHoldWD,
                airdropAmountWD: airdropAmountWD,
                rewardAmountWD: rewardAmountWD,

            })

        }
        catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {


        getInfo()
    }, [])

    useEffect(() => {
        if (data) {
            const checkAirdrop = data.filter(e => e.contract_address.toLowerCase() == airdropcontractadresi.toLowerCase())
            const chosenAirdrop = checkAirdrop[0]
            setAddresses(JSON.parse(checkAirdrop[0].tree))
            setCurrentAirdrop(checkAirdrop[0])
        }
    }, [data])


    //db de ki tree json undan kullanıcı adresini bulma
    //adress varsa indexi return ediyor yoksa false
    const findAddress = (address) => {
        const checkIfAddressExists = addresses.filter(e => e.address.toLowerCase() == address.toLowerCase())
        if (checkIfAddressExists.length > 0) {
            return addresses.indexOf(checkIfAddressExists[0])
        } else {
            return false
        }
    }

    //merkletree oluşturuluyor. Array ve index verilerek sonrasında indexin hexproofunu döndürüyor
    const setMerkleTree = (array, indexOfAddress) => {
        const balances = []
        array.forEach(add => {
            balances.push({
                addr: add.address, amount: web3g.web3.eth.abi.encodeParameter(
                    "uint256",
                    add.amount
                )
            })
        })

        const leafNodes = balances.map(balance => {
            return keccak256(
                Buffer.concat([
                    Buffer.from(balance.addr.replace("0x", ""), "hex"),
                    Buffer.from(balance.amount.replace("0x", ""), "hex"),
                ])
            )
        }

        );
        const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
        const proof = merkleTree.getHexProof(leafNodes[indexOfAddress])
        console.log(merkleTree.getHexProof(leafNodes[1]))
        return proof
    }



    const onChangeReward = async (e) => {
        let val = e.target.value
        e.preventDefault()
        setInputVal(val)

        if (val.length === 42 && val[0] == "0" && val[1] == "x") {
            // setButtonClaim(true)
            setIsValid(true)
            const isAddressInTree = findAddress(val)
            if (!isAddressInTree) {
                setAddressExists(false)
                return
            }
            if (isClaimed(val) == true) {
                setClaimed(true)
                return
            } else {
                setAddressExists(true)
                setClaimed(false)
                setButtonClaim(true)
            }

        } else {
            setButtonClaim(false)
            setIsValid(false)
        }
    }

    const addressFormSubmit = (e) => {
        e.preventDefault()
        if (buttonClaim && isValid) {
            const indexOfProof = findAddress(inputVal)
            const proof = setMerkleTree(addresses, indexOfProof)
            console.log(addresses, indexOfProof)

            claim(inputVal, proof)
        } else {
            e.preventDefault()
        }
    }

    const isClaimed = async (addr) => {
        const web3 = new Web3(info.readOnlyApi)
        const aContract = new web3.eth.Contract(singleAirdropAbi, airdropcontractadresi)
        const res = await aContract.methods.isClaimed(addr).call();
        return res
    }

    const claim = async (address, hexProof) => {

        const aContract = new web3g.web3.eth.Contract(singleAirdropAbi, airdropcontractadresi)
        const account = web3g.walletAddress
        console.log(address, airdropInfo.rewardAmount, hexProof)
        let ret = await aContract.methods.claim(address, airdropInfo.rewardAmount, hexProof).send({ from: account }, function (error, transactionHash) {
            if (!error) {
                toast.info(CustomToastWithLink(transactionHash))
                waitForReceipt(transactionHash, function (receipt) {
                    if (receipt.status) {
                        toast.success('Transaction confirmed!')
                    } else {
                        toast.error(error.message)
                    }
                })
            }
        })

    }




    return (
        <>

            <div className="w-full h-[75vh] mb-10 mt-32">

                <div className="flex flex-col justify-evenly items-center w-[90%] sm:w-[75%] md:w-[65%] mx-auto rounded-lg h-full bg-black text-[#FBBD17] text-[25px]">
                    <div className="h-[60%] w-full">
                        <div className="flex h-[25%] w-full justify-around">
                        </div>
                        <div className="flex flex-col justify-around items-center h-[75%]">
                            <span>Total Reward {Number(airdropInfo.airdropAmountWD).toFixed(2) + " " + airdropInfo.rewardTokenSymbol}  </span>
                            <span>Reward per Wallet {Number(airdropInfo.rewardAmountWD).toFixed(2) + " " + airdropInfo.rewardTokenSymbol}  </span>
                            <span className="text-center">You must hold minimum {Number(airdropInfo.minimumHoldWD).toFixed(2) + " " + airdropInfo.holdTokenSymbol}</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center w-[90%] md:w-[50%] max-h-[60%]">
                        <form id='adress_form' onSubmit={addressFormSubmit} className="min-w-[80%]">
                            <label>
                                <input onChange={onChangeReward} value={inputVal} disabled={!connected} className=" text-center rounded-md mb-8 placeholder:italic h-12 w-full" type="text" maxLength={42} placeholder="check reward" />
                            </label>
                            <div className='flex justify-center h-32'>
                                {buttonClaim &&
                                    <button type="submit" className="tranisiton w-[180px] rounded-md font-bold italic h-12 text-black bg-[#FBBD17]">Claim Reward</button>}

                            </div>
                            <div className="text-center">
                                {!connected && <span>Please Connect Your Wallet</span>}
                                {!isValid && <> <br /><span>Please enter your wallet address</span></>}
                                {!addressExists && <span> This address is not have a right to claim!.</span>}
                                {claimed && <span>This address already got the reward.</span>}
                                {buttonClaim && <span>Click to claim your reward</span>}
                            </div>
                        </form>
                    </div>



                </div>
            </div>
        </>

    )
}


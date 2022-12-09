import React, { useState, useEffect } from 'react'
import keccak256 from "keccak256";
import { MerkleTree } from "merkletreejs";
import Web3 from "web3";
import { useDispatch, useSelector } from 'react-redux';
import info from "../info.json"
import { airdropAbi } from "../abi/airdropAbi"
import { tokenAbi } from "../abi/tokenAbi"
import { toast } from 'react-toastify';
import { addDecimal, convert } from '../features/web3/web3functs';
import { updateWallet } from '../app/connectWeb3'


function Airdropadmin() {
    const web3 = new Web3(info.readOnlyApi);

    const dispatch = useDispatch();
    const { web3g, pending, error } = useSelector((state) => state.wallet)
    const [merkelRoot, setMerkelRoot] = useState("");
    const [screen, setScreen] = useState("firstScreen");
    const [totalReward, setTotalReward] = useState("");
    const [singleReward, setSingleReward] = useState("");
    const [formData, setFormData] = useState({ holdTokenInput: '', rewardTokenInput: '', minimumHoldAmountInput: '', totalRewardInput: '' });
    const { holdTokenInput, rewardTokenInput, minimumHoldAmountInput, totalRewardInput } = formData;
    const [dataArray, setDataArray] = useState([]);
    const [decimal1, setDecimal1] = useState(0);
    const [walletsRewarded, setWalletsRewarded] = useState(0);
    const [tokenName, setTokenName] = useState("");
    const [singleWalletReward, setSingleWalletReward] = useState(0);
    const [minimumHold, setMinimumHold] = useState("");
    const [approvedEnough, setApprovedEnough] = useState(false)
    //console.log("Proof 1: " + merkleTree.getHexProof(leafNodes[0]));

    const CustomToastWithLink = (hash) => (
        <div>
            <a href={info.blockExplorer + "tx/" + hash} target='_blank'>Transaction send click to see on explorer</a>
        </div>
    );

    function waitForReceipt(hash, cb) {
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



    const getUserInfo = async () => {
        const accounts = await web3g.web3.eth.getAccounts();
        const wallet = accounts[0];
        const tokenContract = new web3g.web3.eth.Contract(tokenAbi, rewardTokenInput);
        const tokenDecimal = await tokenContract.methods.decimals().call();
        const tokenAmount = await addDecimal(totalRewardInput, tokenDecimal);
        const approvedAmount = await tokenContract.methods.allowance(wallet, info.airdropContractAddress).call();
        if (approvedAmount >= tokenAmount) setApprovedEnough(true);
    }

    const createAirdrop = async (a, b, c, d, e, f) => {
        const accounts = await web3g.web3.eth.getAccounts();
        const wallet = accounts[0];
        const airdropContract = new web3g.web3.eth.Contract(airdropAbi, info.airdropContractAddress);

        try {
            airdropContract.methods.create(a, b, c, d, e, f).send({ from: wallet }, function (error, transactionHash) {
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
        } catch (e) {
            console.log(e)
            toast.error(e.message)
        }


    }

    const [inputCheck, setInputCheck] = useState(false);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))

        if (holdTokenInput !== "" && rewardTokenInput !== "" && minimumHoldAmountInput !== "" && totalRewardInput !== "") {
            setInputCheck(true)
        }
    }

    const covalentQuery = async (x) => {
        try {
            const response = await fetch(`https://api.covalenthq.com/v1/${info.chainId}/tokens/${holdTokenInput}/token_holders/?quote-currency=USD&format=JSON&page-size=500000&block-height=latest&key=${info.covalentApi}`);
            const data = await response.json();

            const decimal = data.data.items[0].contract_decimals;
            setDataArray(data.data.items);
            setDecimal1(decimal);
            const rewardTokenDecimal = await getRewardTokenDecimal(rewardTokenInput);

            let tokenNameGet = data.data.items[0].contract_name;
            setTokenName(tokenNameGet);
            const minimumHoldWithDecimal = await addDecimal(minimumHoldAmountInput, decimal);
            setMinimumHold(minimumHoldWithDecimal);
            const filteredData = data.data.items.filter(e => Number(e.balance) > Number(minimumHoldWithDecimal))
            const singleFrontend = Number(totalRewardInput) / filteredData.length;
            const singleFrontendFixed = singleFrontend.toFixed(0)
            const rewardWD = await addDecimal(String(singleFrontend), String(rewardTokenDecimal))

            setSingleWalletReward(singleFrontendFixed);
            setWalletsRewarded(filteredData.length);
            const totalRewardWithDecimal = await addDecimal(totalRewardInput, String(rewardTokenDecimal));
            setTotalReward(totalRewardWithDecimal);

            let balances = [];

            const fixedReward = Number(rewardWD).toFixed(0)
            setSingleReward(fixedReward);
            const filteredDataAdresses = filteredData.map(e => e.address)
            filteredDataAdresses.forEach(add => {
                balances.push({
                    addr: add, amount: web3.eth.abi.encodeParameter(
                        "uint256",
                        fixedReward
                    )
                })
            })
            const leafNodes = balances.map(balance => {
                let index = balances.indexOf(balance);

                return keccak256(
                    Buffer.concat([
                        Buffer.from(balance.addr.replace("0x", filteredDataAdresses[index]), "hex"),
                        Buffer.from(balance.amount.replace("0x", fixedReward), "hex"),
                    ])
                )
            }

            );
            const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
            const mRoot = merkleTree.getHexRoot();
            console.log(merkleTree.getHexProof(leafNodes[0]))
            setMerkelRoot(mRoot);
            console.log(leafNodes, JSON.stringify(leafNodes))




        }
        catch (e) {
            console.log(e)
        }
    }



    function formSubmit(e) {
        setScreen("loading")
        getUserInfo()

        async function getCovalentQuery() {

            covalentQuery(holdTokenInput);

        }
        getCovalentQuery()

        setScreen("secondScreen")
        e.preventDefault()
    }

    async function airDropProcess() {
        console.log(rewardTokenInput, merkelRoot, totalReward, holdTokenInput, singleReward, minimumHold)
        createAirdrop(rewardTokenInput, merkelRoot, totalReward, holdTokenInput, String(singleReward), minimumHold);
    }

    const getRewardTokenDecimal = async (x) => {
        const tokenC = new web3.eth.Contract(tokenAbi, x);
        const dec = await tokenC.methods.decimals().call();
        return dec;
    }

    async function approve() {

        const accounts = await web3g.web3.eth.getAccounts();
        const wallet = accounts[0];
        const tokenContract = new web3g.web3.eth.Contract(tokenAbi, rewardTokenInput);
        const tokenDecimal = await tokenContract.methods.decimals().call();
        const tokenAmount = await addDecimal(totalRewardInput, tokenDecimal);


        try {
            tokenContract.methods.approve(info.airdropContractAddress, tokenAmount).send({ from: wallet }, function (error, transactionHash) {
                if (!error) {
                    toast.info(CustomToastWithLink(transactionHash))
                    waitForReceipt(transactionHash, function (receipt) {
                        if (receipt.status) {
                            toast.success('Transaction confirmed!')
                            getUserInfo()
                        } else {
                            toast.error(error.message)
                        }
                    })
                }
            })
        } catch (e) {
            toast.error(e.message)
        }
    }


    return (
        <div className="flex justify-center mt-32 mx-auto h-[75vh] text-[22px]">

            {screen === "firstScreen" ?

                <div className="bg-black rounded-[10px] w-[90%] xl:w-[65%]">

                    <form className="h-full flex flex-col justify-around pt-8 items-center" onSubmit={formSubmit}>
                        <div className="w-[75%] h-[60px]">
                            <label className="text-[#FBBD17] text-[12px] sm:text-[20px] italic">Hold Token Contract Address
                                <input onChange={onChange} required className="w-full h-[75%] placeholder:italic placeholder:text-ellipsis overflow-auto rounded-md indent-3 text-[15px] sm:text-[20px]" name="holdTokenInput" type="text" placeholder="Please enter the hold token contract address" />
                            </label>
                        </div>

                        <div className="w-[75%] h-[60px]">
                            <label className="text-[#FBBD17]  text-[12px] sm:text-[20px] italic">Reward Token Contract Address
                                <input onChange={onChange} required className="w-full h-[75%] placeholder:italic rounded-md indent-3 text-[15px] sm:text-[20px]" name="rewardTokenInput" type="text" placeholder="Please enter reward token contract address" />
                            </label>
                        </div>

                        <div className="w-[75%] h-[60px]">
                            <label className="text-[#FBBD17] text-[12px] sm:text-[20px] italic">
                                Minimum Hold Amount
                                <input onChange={onChange} required className="w-full h-[75%] placeholder:italic placeholder:text-ellipsis rounded-md indent-3 text-[15px] sm:text-[20px]" name="minimumHoldAmountInput" type="text" placeholder="Please enter minimum hold amount" />
                            </label>
                        </div>

                        <div className="w-[75%] h-[60px]">
                            <label className="text-[#FBBD17] text-[12px] sm:text-[20px] italic">
                                Total Reward
                                <input onChange={onChange} required className="w-full h-[75%] placeholder:italic placeholder:text-ellipsis rounded-md indent-3 text-[15px] sm:text-[20px]" name="totalRewardInput" type="text" placeholder="Please enter total reward" />
                            </label>
                        </div>
                        {!web3g.connected && <button type="button" onClick={() => !web3g.connected && updateWallet({}, dispatch)} className="text-black bg-[#FBBD17] w-[180px] font-bold italic h-[55px] rounded-md">Connect Wallet</button>}

                        {web3g.connected && <button type="submit" className="text-black bg-[#FBBD17] w-[180px] font-bold italic h-[55px] rounded-md">Create Airdrop</button>}
                    </form>

                </div>
                : null}


            {screen === "secondScreen" ?
                <div className="bg-black rounded-[10px] w-[90%] xl:w-[65%] flex justify-center font-bold">
                    <ul className="w-[90%] h-full text-yellow-300  flex flex-col justify-around items-center">
                        <li>Wallets to be Rewarded: {walletsRewarded}</li>
                        <li>Token Name:  {tokenName} </li>
                        <li>Token Decimal: {decimal1}  </li>
                        <li>Reward Per Wallet: {singleWalletReward} </li>
                        <li>Total Reward Amount: {totalRewardInput}</li>
                        <li><button type="click" onClick={approvedEnough ? airDropProcess : approve} className="text-black bg-[#FBBD17] w-[180px] font-bold italic h-[55px] rounded-md">{approvedEnough ? "Create Airdrop" : "Approve"}</button></li>
                    </ul>
                </div> : null
            }

            {screen === "loading" ? <div>Loading...</div> : null}

        </div>


    )
}

export default Airdropadmin

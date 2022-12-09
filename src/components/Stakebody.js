import React, { useEffect, useState } from 'react'
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import Grid from '@mui/system/Unstable_Grid';
import { Typography } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { updateWallet } from '../app/connectWeb3'
import { updatePresale } from '../app/connectPresale'
import info from '../info.json'
import { stakingAbi } from '../abi/stakingAbi'
import { tokenAbi } from '../abi/tokenAbi'
import { removeDecimal, addDecimal } from '../features/web3/web3functs'
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import { toast, ToastContainer } from "react-toastify";
import Web3 from 'web3';




function Stakebody() {

    const colors = {
        boldFirstColor: "#FBBD17",
        boldSecondColor: "#FBBD17",
        cardBackground: "black"
    }

    const [tokenB, settokenB] = useState("");
    const [userStaked, setUserStaked] = useState("");
    const [userReward, setUserReward] = useState("");
    const [approvedAmount, setApprovedAmount] = useState("");
    const [stakingAmount, setStakingAmount] = useState("");
    const [unStakingAmount, setUnStakingAmount] = useState("");
    const [screen, setScreen] = useState(false)
    const [tokenBalance, setTokenBalance] = useState("");
    const [stakedTokenBalance, setStakedTokenBalance] = useState("");

    const [approvedEnough, setApprovedEnough] = useState(false);

    const [modalState, setModalState] = useState("");


    const dispatch = useDispatch();
    const { web3g, pending, error } = useSelector((state) => state.wallet)
    const { pStats, pspending, pserror } = useSelector((state) => state.stake)
    useEffect(() => {
        if (web3g.connected && web3g.rightChain) {
            getStakeInfo();
            web3g.web3.eth.subscribe('newBlockHeaders', getStakeInfo);
        }
    }, [web3g])

    useEffect(() => {
        const web3 = new Web3(info.readOnlyApi)
        const ups = () => {
            updatePresale({}, dispatch)
        }
        web3.eth.subscribe('newBlockHeaders', ups);
    }, [])
    const CustomToastWithLink = (hash) => (
        <div>
            <a href={info.blockExplorer + "tx/" + hash} target='_blank'>Transaction send click to see on explorer</a>
        </div>
    );


    async function getStakeInfo() {

        const BN = web3g.web3.utils.BN;
        const accounts = await web3g.web3.eth.getAccounts();
        const wallet = accounts[0];
        const stakeContract = new web3g.web3.eth.Contract(stakingAbi, info.contractAddress);
        const stakeTokenContract = new web3g.web3.eth.Contract(tokenAbi, info.stakingTokenAddress);

        //token available in wallet

        const wamount = await stakeTokenContract.methods.balanceOf(wallet).call({ from: wallet });
        const amountwdecimal = await removeDecimal(wamount, info.stakeTokenDecimal);
        setTokenBalance(amountwdecimal)
        const finalTotal = Number(amountwdecimal).toFixed(2);
        const totalSeperated = Number(finalTotal).toLocaleString();
        settokenB(totalSeperated);

        //token staked

        const wwamount = await stakeContract.methods.staked(wallet).call({ from: wallet });
        const amountwodecimal = await removeDecimal(wwamount, info.stakeTokenDecimal);
        setStakedTokenBalance(amountwodecimal)
        const finalStaked = Number(amountwodecimal).toFixed(2);
        const finalStakedSeperated = Number(finalStaked).toLocaleString();
        setUserStaked(finalStakedSeperated);
        //user Reward

        const rewardamount = await stakeContract.methods.earned(wallet).call({ from: wallet });
        const rewarddecimal = await removeDecimal(rewardamount, info.rewardTokenDecimal);
        const finalReward = Number(rewarddecimal).toFixed(2);
        const finalRewardSeperated = Number(finalReward).toLocaleString();
        setUserReward(finalRewardSeperated);
        //user approved token
        const approved = await stakeTokenContract.methods.allowance(wallet, info.contractAddress).call({ from: wallet });
        const bnapproved = approved.toString();
        const approvedWD = await removeDecimal(bnapproved, info.stakeTokenDecimal);
        setApprovedAmount(approvedWD);
        if (approvedAmount > 0) {
            setApprovedEnough(true);
        }
    }

    const handleClose = () => {
        setScreen(false);
        setStakingAmount("");
        setUnStakingAmount("");
    }


    function calculateApprove() {
        if (Number(approvedAmount) >= Number(stakingAmount)) {
            return true
        } else {
            return false
        }
    }


    async function claimReward() {

        const accounts = await web3g.web3.eth.getAccounts();
        const wallet = accounts[0];
        const stakeContract = new web3g.web3.eth.Contract(stakingAbi, info.contractAddress);

        setScreen(false)
        try {
            stakeContract.methods.getReward().send({ from: wallet }, function (error, transactionHash) {
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
            toast.error(e.message)
        }
    }

    async function stake() {

        const accounts = await web3g.web3.eth.getAccounts();
        const wallet = accounts[0];
        const stakeContract = new web3g.web3.eth.Contract(stakingAbi, info.contractAddress);
        const amountStaking = await addDecimal(stakingAmount, info.stakeTokenDecimal);
        setScreen(false);

        try {
            stakeContract.methods.stake(amountStaking).send({ from: wallet }, function (error, transactionHash) {
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
            toast.error(e.message)
        }
    }

    async function unstake() {

        const accounts = await web3g.web3.eth.getAccounts();
        const wallet = accounts[0];
        const stakeContract = new web3g.web3.eth.Contract(stakingAbi, info.contractAddress);
        const amountUnstaking = await addDecimal(unStakingAmount, info.stakeTokenDecimal);
        setScreen(false);


        try {
            stakeContract.methods.withdraw(amountUnstaking).send({ from: wallet }, function (error, transactionHash) {
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
            toast.error(e.message)
        }
    }

    async function approve() {

        const accounts = await web3g.web3.eth.getAccounts();
        const wallet = accounts[0];
        const tokenContract = new web3g.web3.eth.Contract(tokenAbi, info.stakingTokenAddress);
        const amountToApprove = await addDecimal(stakingAmount, info.stakeTokenDecimal);


        try {
            tokenContract.methods.approve(info.contractAddress, amountToApprove).send({ from: wallet }, function (error, transactionHash) {
                if (!error) {
                    toast.info(CustomToastWithLink(transactionHash))
                    waitForReceipt(transactionHash, function (receipt) {
                        if (receipt.status) {
                            toast.success('Transaction confirmed!')
                            getStakeInfo()
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

    function handleStakeChange(e) {
        setStakingAmount(e.target.value);
        calculateApprove();
        console.log(stakingAmount, calculateApprove())
    }



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



    if (screen === true) {
        return (<Box position='fixed' width='100%' height='100vh' top='0px' right='0px' display='flex' justifyContent='center'
            alignItems='center'
            sx={{ bgcolor: colors.boldSecondColor, zIndex: '800' }}>
            <ClickAwayListener onClickAway={handleClose}>

                <Box width='85%' align='center' height='75vh' sx={{ boxShadow: 3, p: { xs: 3, md: 5 }, borderRadius: 3, bgcolor: colors.cardBackground }}>

                    <IconButton sx={{ p: '10px', color: colors.boldSecondColor }} aria-label="directions" onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ color: colors.boldFirstColor, fontSize: 20, fontWeight: 'bold', pt: 5 }}>{modalState === "stake" ? "Stake your " + info.stakingTokenSymbol + " To Earn " + info.rewardTokenSymbol : "Unstake your " + info.stakingTokenSymbol}</Typography>

                    <CardMedia
                        align='center'
                        component="img"
                        src="./staking.png" sx={{ width: '150px', mt: 5 }}>

                    </CardMedia>
                    <Typography sx={{ color: colors.boldSecondColor, fontSize: 20, fontWeight: 'bold', mt: 5 }}>Enter The Amount</Typography>
                    <Paper
                        component="form"
                        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', mt: 5, width: { xs: '95%', md: '60%', sm: '95%' } }}
                    >
                        <InputBase
                            sx={{ ml: 1, flex: 1, color: "black", fontSize: 20, fontWeight: 'bold', display: modalState !== "stake" && "none" }}
                            align='center'
                            placeholder="Enter amount to Stake"
                            onChange={handleStakeChange}
                            value={stakingAmount}
                        />

                        <InputBase
                            sx={{ ml: 1, flex: 1, color: "black", fontSize: 20, fontWeight: 'bold', display: modalState !== "unstake" && "none" }}
                            align='center'
                            placeholder="Enter amount to Unstake"
                            onChange={(e) => setUnStakingAmount(e.target.value)}
                            value={unStakingAmount}
                        />
                        <Divider orientation="vertical">
                            <Typography sx={{ display: modalState !== "stake" && "none", color: "#FBBD17", fontSize: 22, fontWeight: 'bold', fontFamily: 'Monospace', cursor: "pointer" }} onClick={() => setStakingAmount(tokenBalance)}>Stake All</Typography>
                            <Typography sx={{ display: modalState !== "unstake" && "none", color: "#FBBD17", fontSize: 22, fontWeight: 'bold', fontFamily: 'Monospace', cursor: "pointer" }} onClick={() => setUnStakingAmount(stakedTokenBalance)}>Unstake All</Typography>

                        </Divider>
                    </Paper>
                    <Button variant="contained" onClick={() => { calculateApprove() === true ? stake() : approve() }} sx={{
                        fontFamily: 'Monospace', mt: 3, fontWeight: 'bold', display: modalState !== "stake" && "none", fontSize: 16, bgcolor: '#FBBD17', color: 'black', ':hover': {
                            bgcolor: '#F0931F',
                            color: 'black',
                        }
                    }}

                    >
                        {calculateApprove() === true ? "Stake" : "Approve"}
                    </Button>
                    <Button variant="contained" onClick={unstake} sx={{
                        fontFamily: 'Monospace', mt: 3, fontWeight: 'bold', display: modalState !== "unstake" && "none", fontSize: 16, bgcolor: '#FBBD17', color: 'black', ':hover': {
                            bgcolor: '#F0931F',
                            color: 'black',
                        }
                    }}
                    >
                        Unstake
                    </Button>
                </Box>
            </ClickAwayListener>

        </Box>)
    }


    return (
        <Box width='85%' height="100%">
            <Box display="flex" width="100%" height="100%" justifyContent="center" alignItems="center">

                <Grid container sx={{ mt: { md: 18, xs: 11 }, mb: 1 }}>
                    <Grid item xs={12}
                        md={4} sx={{ mb: { xs: 3, md: 0 } }}>
                        <Box width='95%' height='100%' sx={{
                            boxShadow: 3,
                            p: 0,
                            borderRadius: 2,
                            fontSize: '0.875rem',
                            fontWeight: '700',
                            bgcolor: colors.cardBackground,
                        }} >
                            <Grid container sx={{ m: 0, p: 1 }}  >
                                <Grid item xs={12} md={12}>
                                    <Grid >
                                        <Typography sx={{ color: colors.boldFirstColor, fontSize: 25, fontWeight: 'bold', mt: 3, mb: 3, fontFamily: 'Monospace' }}>Staking Info</Typography>
                                    </Grid>
                                    <Grid container display={!web3g.connected ? "none" : (web3g.rightChain ? 'flex' : "none")} >

                                        <Grid item xs={12} md={12} sx={{ mb: 2, mt: 2 }}>
                                            <Typography sx={{ color: colors.boldSecondColor, fontSize: 22, fontWeight: 'medium', fontFamily: 'Monospace' }}>Total Staked</Typography>

                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <Typography sx={{ color: colors.boldFirstColor, fontSize: 22, fontWeight: 'medium', fontFamily: 'Monospace' }}>{userStaked + ' ' + info.stakingTokenSymbol}</Typography>

                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <Button variant="contained" onClick={() => { setModalState('unstake'); setScreen(true) }} sx={{
                                                fontFamily: 'Monospace', fontWeight: 'bold', fontSize: 16, bgcolor: '#FBBD17', color: 'black', ':hover': {
                                                    bgcolor: '#F0931F',
                                                    color: 'black',
                                                }
                                            }}>
                                                {web3g.connected ? "Unstake" : 'Connecting'}
                                            </Button>
                                        </Grid>
                                        <Grid item xs={12} md={12} sx={{ mb: 2, mt: 2 }}>
                                            <Typography sx={{ color: colors.boldSecondColor, fontSize: 22, fontWeight: 'medium', fontFamily: 'Monospace' }}>Available In Wallet</Typography>

                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <Typography sx={{ color: colors.boldFirstColor, fontSize: 22, fontWeight: 'medium', fontFamily: 'Monospace' }}>{tokenB + ' ' + info.stakingTokenSymbol}</Typography>

                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <Button variant="contained" onClick={() => { setModalState('stake'); setScreen(true) }} sx={{
                                                fontFamily: 'Monospace', fontWeight: 'bold', fontSize: 16, bgcolor: '#FBBD17', color: 'black', ':hover': {
                                                    bgcolor: '#F0931F',
                                                    color: 'black',
                                                }
                                            }}>
                                                {web3g.connected ? "Stake" : 'Connecting'}
                                            </Button>
                                        </Grid>
                                        <Grid item xs={12} md={12} sx={{ mb: 2, mt: 2 }}>
                                            <Typography sx={{ color: colors.boldFirstColor, fontSize: 22, fontWeight: 'medium', fontFamily: 'Monospace' }}>Claimable Rewards</Typography>

                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <Typography sx={{ color: colors.boldSecondColor, fontSize: 22, fontWeight: 'medium', fontFamily: 'Monospace' }}>{userReward + ' ' + info.rewardTokenSymbol}</Typography>

                                        </Grid>
                                        <Grid item xs={6} md={6} sx={{ mb: 5 }}>
                                            <Button variant="contained" onClick={claimReward} sx={{
                                                fontFamily: 'Monospace', fontWeight: 'bold', fontSize: 16, bgcolor: '#FBBD17', color: 'black', ':hover': {
                                                    bgcolor: '#F0931F',
                                                    color: 'black',
                                                }
                                            }}>
                                                {web3g.connected ? "Claim" : 'Connecting'}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid container display={web3g.connected && "none"}>
                                    <Grid item xs={12} md={6}>
                                        <CardMedia
                                            component="img"
                                            src="./wallet.png">
                                        </CardMedia>
                                    </Grid>
                                    <Grid item xs={12} md={6} display='flex' alignItems='center' justifyContent='center' >
                                        <Grid>
                                            <Typography sx={{ color: colors.boldSecondColor, fontSize: 22, fontWeight: 'medium', m: 1, fontFamily: 'Monospace' }}>Please connect your wallet to see your staking balance and rewards.</Typography>
                                            <Button variant="contained" onClick={() => !web3g.connected && updateWallet({}, dispatch)} sx={{
                                                fontFamily: 'Monospace', fontWeight: 'bold', fontSize: 16, bgcolor: '#FBBD17', mt: 2, mb: 2, color: 'black', ':hover': {
                                                    bgcolor: '#F0931F',
                                                    color: 'black',
                                                }
                                            }} endIcon={<AccountBalanceWalletIcon />}>
                                                {pending ? 'Connecting' : web3g.connected ? "" : "Connect"}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid container display={!web3g.connected ? "none" : (web3g.rightChain && "none")}>
                                    <Grid item xs={12} md={6}>
                                        <CardMedia
                                            component="img"
                                            src="./wallet.png">
                                        </CardMedia>
                                    </Grid>
                                    <Grid item xs={12} md={6} display='flex' alignItems='center' justifyContent='center' >
                                        <Grid>
                                            <Typography sx={{ color: colors.boldSecondColor, fontSize: 22, fontWeight: 'medium', m: 1, fontFamily: 'Monospace' }}>Please change your network to {info.networkName}.</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>

                            </Grid>

                        </Box>
                    </Grid>
                    <Grid item xs={12}
                        md={8}>
                        <Grid container >
                            <Grid item xs={12} md={6} sx={{ mb: 3 }}>
                                <Box width='95%' height='100%' sx={{
                                    boxShadow: 3,
                                    p: 0,
                                    borderRadius: 2,
                                    fontSize: '0.875rem',
                                    fontWeight: '700',
                                    bgcolor: colors.cardBackground,
                                }} >
                                    <Grid container sx={{ p: 1 }}>
                                        <Grid item xs={12} md={6} display='flex' alignItems='center' justifyContent='center' >
                                            <Grid item sx={{ mt: 3, mb: 3 }}>
                                                <Typography sx={{ color: colors.boldFirstColor, fontSize: 23, fontWeight: 'bold', fontFamily: 'Monospace', mt: 3, mb: 3 }}>Total Staked</Typography>
                                                <Typography sx={{ color: colors.boldFirstColor, fontSize: 22, fontWeight: 'medium', fontFamily: 'Monospace' }}>{pStats.totalStakedSeperated}</Typography>
                                                <Typography sx={{ color: colors.boldSecondColor, fontSize: 25, fontWeight: 'bold', fontFamily: 'Monospace', mt: 3, mb: 3 }}>PHICS</Typography>


                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} md={6} display='flex' alignItems='center' justifyContent='center' >
                                            <CardMedia
                                                component="img"
                                                src="./lockicon.webp"
                                                sx={{
                                                    width: "100px"
                                                }}>
                                            </CardMedia>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6} sx={{ mb: 3 }}>
                                <Box width='95%' height='100%' sx={{
                                    boxShadow: 3,
                                    p: 0,
                                    borderRadius: 2,
                                    fontSize: '0.875rem',
                                    fontWeight: '700',
                                    bgcolor: colors.cardBackground,
                                }} >
                                    <Grid container sx={{ p: 1 }}>
                                        <Grid item xs={12} md={6} display='flex' alignItems='center' justifyContent='center' >
                                            <Grid item sx={{ mt: 3, mb: 3 }}>
                                                <Typography sx={{ color: colors.boldFirstColor, fontSize: 23, fontWeight: 'bold', fontFamily: 'Monospace', mt: 3, mb: 3 }}>Reward Rate</Typography>
                                                <Typography sx={{ color: colors.boldFirstColor, fontSize: 22, fontWeight: 'medium', fontFamily: 'Monospace' }}>{pStats.apr}%</Typography>
                                                <Typography sx={{ color: colors.boldSecondColor, fontSize: 25, fontWeight: 'bold', fontFamily: 'Monospace', mt: 3, mb: 3 }}>MODEL to PHICS</Typography>


                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} md={6} display='flex' alignItems='center' justifyContent='center' >
                                            <CardMedia
                                                component="img"
                                                src="./models.png"
                                                sx={{
                                                    width: "100px"
                                                }}>
                                            </CardMedia>
                                        </Grid>
                                    </Grid>

                                </Box>
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <Box width='98%' height='100%' sx={{
                                    boxShadow: 3,
                                    p: 0,
                                    borderRadius: 2,
                                    fontSize: '0.875rem',
                                    fontWeight: '700',
                                    bgcolor: colors.cardBackground,
                                }} >
                                    <Grid container sx={{ p: 1 }}>
                                        <Grid item xs={12} md={12}>
                                            <Typography align="center" sx={{ color: colors.boldFirstColor, fontSize: 25, fontWeight: 'bold', mt: 3, fontFamily: 'Monospace' }}>Ecosystem Info</Typography>

                                        </Grid>

                                        <Grid item xs={12} md={4} display='flex' alignItems='center' justifyContent='center' >
                                            <Grid item sx={{ mt: 3, mb: 3 }}>
                                                <Typography sx={{ color: colors.boldFirstColor, fontSize: 23, fontWeight: 'bold', fontFamily: 'Monospace', mt: 3, mb: 3 }}>Daily Rewards</Typography>
                                                <Typography sx={{ color: colors.boldSecondColor, fontSize: 22, fontWeight: 'medium', fontFamily: 'Monospace' }}>{pStats.dailyRewardSeperated + ' ' + info.rewardTokenSymbol}</Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} md={4} display='flex' alignItems='center' justifyContent='center' >
                                            <Grid item sx={{ mt: 3, mb: 3 }}>
                                                <Typography sx={{ color: colors.boldFirstColor, fontSize: 23, fontWeight: 'bold', fontFamily: 'Monospace', mt: 3, mb: 3 }}>{info.stakingTokenSymbol + " Total Supply"}</Typography>
                                                <Typography sx={{ color: colors.boldSecondColor, fontSize: 22, fontWeight: 'medium', fontFamily: 'Monospace' }}>{pStats.tsupdecimalsseperated + " " + info.stakingTokenSymbol}</Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} md={4} display='flex' alignItems='center' justifyContent='center' >
                                            <Grid item sx={{ mt: 3, mb: 3 }}>
                                                <Typography sx={{ color: colors.boldFirstColor, fontSize: 23, fontWeight: 'bold', fontFamily: 'Monospace', mt: 3, mb: 3 }}>{info.rewardTokenSymbol + " Total Supply"}</Typography>
                                                <Typography sx={{ color: colors.boldSecondColor, fontSize: 22, fontWeight: 'medium', fontFamily: 'Monospace' }}>{pStats.tsupdecimalsseperatedStake + " " + info.rewardTokenSymbol}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                </Box>
                            </Grid>

                        </Grid>
                    </Grid>




                </Grid>
            </Box>

        </Box>
    )
}

export default Stakebody
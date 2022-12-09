import { psconnectionStart, psconnectionSuccess, psconnectionError } from '../features/web3/presaleSlice'
import Web3 from 'web3'
import info from '../info.json'
import { stakingAbi } from '../abi/stakingAbi'
import { tokenAbi } from '../abi/tokenAbi'
import { removeDecimal } from '../features/web3/web3functs'




const web3 = new Web3(info.readOnlyApi);
const BN = web3.utils.BN;



function convert(n) {
    var sign = +n < 0 ? "-" : "",
        toStr = n.toString();
    if (!/e/i.test(toStr)) {
        return n;
    }
    var [lead, decimal, pow] = n.toString()
        .replace(/^-/, "")
        .replace(/^([0-9]+)(e.*)/, "$1.$2")
        .split(/e|\./);
    return +pow < 0
        ? sign + "0." + "0".repeat(Math.max(Math.abs(pow) - 1 || 0, 0)) + lead + decimal
        : sign + lead + (+pow >= decimal.length ? (decimal + "0".repeat(Math.max(+pow - decimal.length || 0, 0))) : (decimal.slice(0, +pow) + "." + decimal.slice(+pow)))
}



export const updatePresale = async (stake, dispatch) => {

    dispatch(psconnectionStart());
    try {



        const stakeContract = new web3.eth.Contract(stakingAbi, info.contractAddress);
        const stakedUser = await stakeContract.methods.totalUsers().call();
        const stakedAmount = await stakeContract.methods.tSupply().call();
        const swdecimal = await removeDecimal(stakedAmount, info.stakeTokenDecimal);
        const finalTotalStaked = Number(swdecimal).toFixed(2);
        const totalStakedSeperated = Number(finalTotalStaked).toLocaleString();
        const rewardRate = await stakeContract.methods.rewardRate().call();


        const rewardInBn = new BN(rewardRate);
        const rewardWithoutDecimal = await removeDecimal(rewardRate, info.stakeTokenDecimal);


        const avStake = swdecimal / stakedUser;
        const avarageEarn = rewardWithoutDecimal * 31536000 / stakedUser;
        const avStakeE = convert(avStake);
        const avEarnE = convert(avarageEarn);
        const apr1 = Number(avEarnE / avStakeE) * 100;


        const apr = apr1.toFixed(2);


        const secsInyear = new BN(86400);

        const dReward = new BN(secsInyear.mul(rewardInBn));
        const rewardWDecimal = await removeDecimal(dReward, info.rewardTokenDecimal);
        const dailyReward = Math.round(rewardWDecimal);
        const dailyRewardSeperated = Number(dailyReward).toLocaleString();

        const tokenContract = new web3.eth.Contract(tokenAbi, info.rewardTokenAddress);
        const tSup = await tokenContract.methods.totalSupply().call();
        const tSupWdecimals = await removeDecimal(tSup, info.stakeTokenDecimal);
        const tsupdecimalsseperated = Number(tSupWdecimals).toLocaleString();

        const staketokenContract = new web3.eth.Contract(tokenAbi, info.stakingTokenAddress);
        const tSupStake = await staketokenContract.methods.totalSupply().call();
        const staketSupWdecimals = await removeDecimal(tSupStake, info.stakeTokenDecimal);
        const staketsupdecimalsseperated = Number(staketSupWdecimals).toLocaleString();



        const stakingInfo = {
            totalStakedSeperated: totalStakedSeperated,
            apr: apr,
            dailyRewardSeperated: dailyRewardSeperated,
            tsupdecimalsseperated: tsupdecimalsseperated,
            tsupdecimalsseperatedStake: staketsupdecimalsseperated,
        }
        dispatch(psconnectionSuccess(stakingInfo))
    } catch (error) {
        dispatch(psconnectionError());
        console.log(error)
    }
}
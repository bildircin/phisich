import { connectionStart, connectionSuccess, connectionError } from '../features/web3/walletSlice'
import Web3 from 'web3'
import web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import info from '../info.json'
import { toast, ToastContainer } from "react-toastify";






const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider,
        options: {
            rpc: {
                56: 'https://bsc-dataseed.binance.org/'
            },
            network: 'binance',
            chainId: 56,
            infuraId: "daf59723edda42bbb16bea0ab1c7ec3a",
        }
    }
};

const Web3Modal = new web3Modal({
    cacheProvider: true, // optional
    providerOptions // required
});



export const updateWallet = async (wallet, dispatch) => {
    dispatch(connectionStart());
    try {
        const provider = await Web3Modal.connect();
        const web3 = new Web3(provider);
        var rightC;
        const cId = info.chainId;
        const ad = await web3.eth.getAccounts();
        const network = await web3.eth.getChainId();
        const walletAddress = ad[0];
        console.log(network, cId)
        if (cId == network) {
            rightC = true;
        } else {
            rightC = false;
            toast.error("You are on wrong network!!", {
                position: "top-right",
                pauseOnHover: true,
            })
        }
        const web3Info = {
            walletAddress: walletAddress,
            network: network,
            connected: true,
            web3: web3,
            provider: provider,
            rightChain: rightC,
        }
        dispatch(connectionSuccess(web3Info))
    } catch (error) {
        dispatch(connectionError());
        toast.error(error.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        })
    }
}
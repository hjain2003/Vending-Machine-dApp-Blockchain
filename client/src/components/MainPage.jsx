import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import './MainPage.css';
import vendingMachineContract from '../blockchain/vending.js';

const MainPage = () => {
    const [inventory, setInventory] = useState('');
    const [myDonutCount, setDonutCount] = useState('');
    const [quantity, setQuantity] = useState('');
    const [web3, setWeb3] = useState(null);
    const [address, setAddress] = useState(null);
    const [vmContract, setVmContract] = useState(null);
    const [transactionStatus, setTransactionStatus] = useState('');
    const [walletBalance, setWalletBalance] = useState('');


    useEffect(() => {
        if (vmContract)
            getInventory();
        if (vmContract && address)
            getMyDonutCount();
        if(address)
            getWalletBalance();
    }, [vmContract, address]);

    const getWalletBalance = async () => {
        if (web3 && address) {
          try {
            const balance = await web3.eth.getBalance(address);
            setWalletBalance(web3.utils.fromWei(balance, 'ether'));
          } catch (error) {
            console.log(error);
          }
        }
      };
      

    const getInventory = async () => {
        setInventory('Loading...');
        const inventory = await vmContract.methods.getVendingMachineBalance().call();
        console.log("Inventory : ", inventory);
        setInventory(Number(inventory).toString());
    };

    const getMyDonutCount = async () => {
        const count = await vmContract.methods.donutBalances(address).call();
        setDonutCount(Number(count).toString());
        console.log('My donuts : ', count);
    };

    const handleChange = (e) => {
        setQuantity(e.target.value);
    }

    const purchase_donut = async () => {
        setTransactionStatus('Pending...');
        try {
            await vmContract.methods.purchase(quantity).send({
                from: address,
                value: web3.utils.toWei('0.1', 'ether') * quantity
            })
            setTransactionStatus(` ${quantity} Purchase Successfull!!`)
        } catch (error) {
            console.log(error);
        }
    }

    const connectWallet = async () => {
        //check if wallet exists
        if (typeof window !== "undefined" && typeof window.ethereum !== 'undefined') {
            try {
                //connect to wallet
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                //set web3 instance
                const newWeb3 = new Web3(window.ethereum);
                setWeb3(newWeb3);
                //get list of accounts
                const accounts = await newWeb3.eth.getAccounts();
                //fetch connected wallet address
                setAddress(accounts[0]);

                //create local contract copy
                const vm = vendingMachineContract(newWeb3);
                setVmContract(vm);
            } catch (error) {
                console.log(error);
            }
        } else {
            console.log('Metamask not installed');
        }
    };

    return (
        <>
            <nav>
                <h1>Vending Machine</h1>
                <button id="wallet" onClick={connectWallet}>
                    Connect Wallet
                </button>
            </nav>
            <div className="container">
                <span id="balance">Current balance : <b>{walletBalance} ETH</b> </span>
                <h1>Buy A Donut</h1>
                <div className="stats_container">
                    <span className='info' id="top_info">Inventory : {inventory} </span>
                    <span className='info'>My Donuts : {myDonutCount} </span>
                </div>
                <br /><br />
                <div className='purchase'>
                    <input type="number" placeholder='Enter quantity' onChange={handleChange} />
                    <button id="purchase_donut" onClick={purchase_donut}>Purchase Donut</button>
                </div>
                <br />
                <span id="trans_msg">{transactionStatus}</span>
            </div>
        </>
    );
};

export default MainPage;

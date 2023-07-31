import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import './MainPage.css';
import vmContract from '../blockchain/vending.js';

const MainPage = () => {
    const [inventory, setInventory] = useState('');
    const [myDonutCount, setDonutCount] = useState('');
    let web3;

    const getInventory = async () => {
        setInventory('Loading...');
        const inventory = await vmContract.methods.getVendingMachineBalance().call();
        console.log("Inventory : ", inventory);
        setInventory(Number(inventory).toString());
    };

    const getMyDonutCount = async () => {
        const accounts = await web3.eth.getAccounts();
        const count = await vmContract.methods.donutBalances(accounts[0]).call();
        setDonutCount(Number(count).toString());
        console.log('My donuts : ', count);
    };

    const connectWallet = async () => {
        if (typeof window!=="undefined" && typeof window.ethereum !== 'undefined') {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                web3 = new Web3(window.ethereum);
                getMyDonutCount();
            } catch (error) {
                console.log(error);
            }
        } else {
            console.log('Metamask not installed');
        }
    };

    useEffect(() => {
        getInventory();
    }, []);

    return (
        <>
            <nav>
                <h1>Vending Machine</h1>
            </nav>
            <br />
            <button id="wallet" onClick={connectWallet}>
                Connect Wallet
            </button>
            <br />
            <br />
            <div className="container">
                <span>Inventory : {inventory} </span>
                <br />
                <span>My Donuts : {myDonutCount} </span>
            </div>
        </>
    );
};

export default MainPage;

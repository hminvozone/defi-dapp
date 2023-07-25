import React, { useEffect, useState } from 'react';
import './App.css';
import Navbar from './Navbar';
import Web3 from 'web3';
import Tether from '../truffle_abis/Tether.json';
import RWD from '../truffle_abis/RWD.json';
import DecentralBank from '../truffle_abis/DecentralBank.json';
import Main from './Main';

export default function App(props) {
    const [account, setAccount] = useState('0x0');
    const [tether, setTether] = useState({});
    const [rwd, setRwd] = useState({});
    const [decentralBank, setDecentralBank] = useState({});
    const [tetherBalance, setTetherBalance] = useState('0');
    const [rwdBalance, setRwdBalance] = useState('0');
    const [stakingBalance, setStakingBalance] = useState('0');
    const [loading, setLoading] = useState(true);

    const loadWeb3 = async () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            window.alert('No ethereum browser detected! You can checkout meta mask!');
        }
    }

    const loadBlockchainData = async () => {
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        const networkId = await web3.eth.net.getId();

        // load tether contract
        const tetherData = Tether.networks[networkId];
        if (tetherData) {
            const tether = new web3.eth.Contract(Tether.abi, tetherData.address);
            setTether(tether);
            
            const tetherBalance = await tether.methods.balanceOf(accounts[0]).call();
            setTetherBalance(tetherBalance.toString());
        } else {
            window.alert('Error! Tether contract not deployed on detected network!');
        }

        // load rwd contract
        const rwdData = RWD.networks[networkId];
        if (rwdData) {
            const rwd = new web3.eth.Contract(RWD.abi, rwdData.address);
            setRwd(rwd);

            const rwdBalance = await rwd.methods.balanceOf(accounts[0]).call();
            setRwdBalance(rwdBalance.toString());
        } else {
            window.alert('Error! RWD contract not deployed on detected network!');
        }

        // load decentral bank contract
        const decentralBankData = DecentralBank.networks[networkId];
        if (decentralBankData) {
            const decentralBank = new web3.eth.Contract(DecentralBank.abi, decentralBankData.address);
            setDecentralBank(decentralBank);

            const decentralBankStakingBalance = await decentralBank.methods.stakeBalance(accounts[0]).call();
            setStakingBalance(decentralBankStakingBalance.toString());
        } else {
            window.alert('Error! decentralBank contract not deployed on detected network!');
        }

        setLoading(false);
    }

    const depositTokens = async (amount) => {
        setLoading(true);
        tether.methods.approve(decentralBank._address, amount).send({ from: account }).on('transactionHash', (hash) => {
            decentralBank.methods.depositTokens(amount).send({ from: account }).on('transactionHash', (hash) => {
                setLoading(false);
            });
        });
    }

    const withdrawTokens = async () => {
        setLoading(true);
        decentralBank.methods.unStakeTokens().send({ from: account }).on('transactionHash', (hash) => {
            setLoading(false);
        });
    }

    useEffect(() => {
        const loadWeb3Func = async () => {
          await loadWeb3();
          await loadBlockchainData();
        };
    
        loadWeb3Func();
    }, []);

    return (
        <div>
            <Navbar account={account} />
            <div className='container-fluid mt-5'>
                <div className='row'>
                    <main role='main' className='col-lg-12 ml-auto mr-auto' style={{ maxWidth: '600px', minHeight: '100vm' }}>
                        <div>
                            {
                                loading ? (
                                    <p id='loader' className='text-center' style={{ margin: '30px' }}>
                                        Loading please wait...
                                    </p>
                                ) : (
                                    <Main 
                                        tetherBalance={tetherBalance}
                                        rwdBalance={rwdBalance}
                                        stakingBalance={stakingBalance}
                                        depositTokens={depositTokens}
                                        withdrawTokens={withdrawTokens}
                                    />
                                )
                            }
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
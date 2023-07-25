import React, { useState } from 'react';
import tether from '../tether.png';
import Airdrop from './Airdrop';

export default function Main(props) {
    const [stakeToken, setStakeToken] = useState('');

    const stakeTokens = async (e) => {
        e.preventDefault();

        props.depositTokens(window.web3.utils.toWei(stakeToken, 'Ether'));

        return;
    }

    return (
        <div id='content' className='mt-3'>
            <table className='table text-muted text-center'>
                <thead>
                    <tr style={{ color: 'black' }}> 
                        <th scope='col'>
                            Staking Balance
                        </th>

                        <th scope='col'>
                            Reward Balance
                        </th>
                    </tr>
                </thead>
                <tbody>
                <tr style={{ color: 'black' }}> 
                        <td>
                            {window.web3.utils.fromWei(props.stakingBalance, 'Ether')} USDT
                        </td>

                        <td>
                            {window.web3.utils.fromWei(props.rwdBalance, 'Ether')} RWD
                        </td>
                    </tr>
                </tbody>
            </table>

            <div className='card mb-2' style={{ opacity: '.9' }}>
                <form className='mb-3' onSubmit={stakeTokens}>
                    <div style={{ borderSpace: '0 1em' }}>
                        <label className='float-left' style={{ marginLeft: '15px' }}><b>Stake Tokens</b></label>
                        <span className='float-right' style={{ marginLeft: '8px' }}>Balance: {window.web3.utils.fromWei(props.tetherBalance, 'Ether')}</span>
                        <div className='input-group mb-4'>
                            <input 
                                type='text'
                                placeholder='0'
                                onChange={(e) => setStakeToken(e.target.value)}
                                value={stakeToken}
                                required 
                            />
                            <div className='input-grouped-open'>
                                <div className='input-group-text'>
                                    <img src={tether} height='32' />
                                    &nbsp;&nbsp;&nbsp; USDT
                                </div>
                            </div>
                        </div>
                        <button type='submit' className='btn btn-primary btn-lg btn-block'>Deposit</button>
                    </div>
                </form>
                <button className='btn btn-primary btn-lg btn-block' onClick={props.withdrawTokens}>WITHDRAW</button>
                <div className='card-body text-center' style={{ color: 'blue' }}>
                    AIRDROP
                    <Airdrop 
                        stakingBalance={props.stakingBalance}
                    />
                </div>
            </div>
        </div>
    )
}
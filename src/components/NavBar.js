// Navigation bar

import React from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import AppContext  from './AppContext.js';

const NavBar=() =>{
    const {userType} = useContext(AppContext);
    if(userType === 'customer'){
        return (
        <div className='nav'>
            <Link to="/" style={{padding:5}}>Home</Link>
            <Link to="/login" style={{padding:5}}>Login</Link>
            <Link to="/createwallet" style={{padding:5}}>Create Wallet</Link>
            <Link to="/decryptwallet" style={{padding:5}}>Decrypt Wallet</Link>
            <Link to="/buyticket" style={{padding:5}}>Buy Ticket</Link>
            <Link to="/returnticket" style={{padding:5}}>Return Ticket</Link>
            <Link to="/checkbalance" style={{padding:5}}>Check Balance</Link>
        </div>
        );
    } else{
        return (
            <div className='nav'>
            <Link to="/" style={{padding:5}}>Home</Link>
            <Link to="/login" style={{padding:5}}>Login</Link>
            <Link to="/checkbalance" style={{padding:5}}>Check Balance</Link>
            </div>
        );

    }
}

export default NavBar;
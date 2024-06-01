// Navigation bar

import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
    return (
        <div>
            <Link to="/" style={{padding:5}}>Home</Link>
            <Link to="/login" style={{padding:5}}>Login</Link>
            <Link to="/createwallet" style={{padding:5}}>Create Wallet</Link>
            <Link to="/decryptwallet" style={{padding:5}}>Decrypt Wallet</Link>
            <Link to="/sendtransaction" style={{padding:5}}>Send Transaction</Link>
            <Link to="/checkbalance" style={{padding:5}}>Check Balance</Link>
        </div>
    );
}

export default NavBar;
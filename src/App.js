import './App.css';
import Login from './components/Login';
import CreateWallet from './components/CreateWallet';
import BuyTicket from './components/Transaction';
import Home from './components/Home';
import DecryptWallet from './components/DecryptWallet.js';
import CheckBalance from './components/CheckBalance.js';
import ReturnTicket from './components/ReturnTicket.js';

import { Routes, Route} from "react-router-dom";


function App() {
  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/createwallet" element={<CreateWallet />} />
        <Route path="/decryptwallet" element={<DecryptWallet />} />
        <Route path="/buyticket" element={<BuyTicket />} />
        <Route path="/returnticket" element={<ReturnTicket />} />
        <Route path="/checkbalance" element={<CheckBalance />} />
    </Routes>
  );
}

export default App;

import './App.css';
import Login from './components/Login';
import CreateWallet from './components/CreateWallet';
import BuyTicket from './components/Transaction';
import Home from './components/Home';
import DecryptWallet from './components/DecryptWallet.js';
import CheckBalance from './components/CheckBalance.js';
import ReturnTicket from './components/ReturnTicket.js';

import { Routes, Route} from "react-router-dom";

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './Store.js';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
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
      </PersistGate>
    </Provider>
  );
}

export default App;

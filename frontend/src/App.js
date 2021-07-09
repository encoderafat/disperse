import React from 'react'; 
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import Toolbar from './components/Toolbar';
import Home from './containers/Home';
import Native from './containers/Native';
import Tokens from './containers/Tokens';

function getLibrary(provider, connector) {
  return new Web3Provider(provider) // this will vary according to whether you use e.g. ethers or web3.js
}

function App() {

  return (
    <Router>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Toolbar />
          <Switch>
            <Route path="/Tokens">
              <Tokens />
            </Route>
            <Route path="/Native">
              <Native />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
      </Web3ReactProvider>
    </Router>
  );
}

export default App;
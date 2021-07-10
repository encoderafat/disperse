import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Button, Divider } from 'semantic-ui-react';
import { ethers } from "ethers";
import { useWeb3React } from '@web3-react/core';
import { injectedConnector } from '../web3/connectors';
import { Balance} from '../components/WalletConnector';
import Front from '../components/Front';

const Home = () => {
    const { chainId, account, activate, active } = useWeb3React();

    const onButtonClick = () => {
        activate(injectedConnector);
    }
    console.log(active);
    console.log(account);
    console.log(chainId);

    const Wallet = () => {
        return (
          <div>
            <h4>USER ACCOUNT</h4>
            {active ? (
              <div>
                <div>ChainId: {chainId}</div>
                <div>Account: {account}</div>   
              </div>
            ) : (
              <Button basic color='green' onClick={onButtonClick}>
                Connect To MetaMask
              </Button>
            )}
            {active && 
            <>
              <Balance />
            </>
            }
          </div>
        )
      }

      if (active) {
          return (
                <Grid centered>
                    <Grid.Row>
                        <Wallet />
                    </Grid.Row>
                    <Grid.Row columns={2}>
                      <Grid.Column textAlign="center">
                        <Grid.Row>
                          <h4>Disperse Native Currency</h4>
                        </Grid.Row>
                        <Divider />
                        <Grid.Row>
                          <Button basic color='green' as={Link} to='/Native'>Disperse Currency</Button>
                        </Grid.Row>
                      </Grid.Column>
                      <Grid.Column textAlign="center">
                        <Grid.Row>
                          <h4>Disperse ERC20/XRC20 Tokens</h4>
                        </Grid.Row>
                        <Divider />
                        <Grid.Row>
                          <Button basic color='green' as={Link} to='/Tokens'>Disperse Tokens</Button>
                        </Grid.Row>
                      </Grid.Column>
                    </Grid.Row>
                </Grid>
          )
      }

      return (
        <div>
          <Front onButtonClick={onButtonClick} />
        </div>
      )

}

export default Home;
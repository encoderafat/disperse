import React, { useEffect } from 'react'; 
import { useWeb3React } from '@web3-react/core';
import useSWR from 'swr';
import { formatEther, formatUnits } from "@ethersproject/units";
import { Contract } from '@ethersproject/contracts';
import { isAddress } from '@ethersproject/address';
import ERC20 from '../contracts/erc20.json';
import { Table } from 'semantic-ui-react';


const fetcher = (library,abi) => (...args) => {
  const [arg1, arg2, ...params] = args;

  if (isAddress(arg1)) {
    const address = arg1;
    const method = arg2;
    const contract = new Contract(address, abi, library.getSigner());
    return contract[method](...params);
  }
  
  const method = arg1;
  return library[method](arg2, ...params);
}

export const Balance = () => {
  const { account, library, chainId } = useWeb3React();
  const { data: balance, mutate } = useSWR(['getBalance', account, 'latest'], {
    fetcher: fetcher(library,ERC20),
  });

  useEffect(() => {
    library.on('block',() => {
      mutate(undefined, true);
    });

    return () => {
      library.removeAllListeners('block');
    };
  },[]);

  if(!balance) {
    return <div>...</div>
  }

  if (chainId === 97) {
      return <div>BNB : {parseFloat(formatEther(balance)).toPrecision(4)}</div>;
  } else if (chainId === 4690) {
      return <div>IOTX-T : {parseFloat(formatEther(balance)).toPrecision(4)}</div>;
  } else {
    return <div>...</div>;
  }
  
}
  
export const TokenBalance = ({ symbol, address, decimals }) => {
  const { account, library } = useWeb3React();
  const { data: balance, mutate } = useSWR([address, 'balanceOf', account], {
    fetcher: fetcher(library, ERC20),
  });

  useEffect(() => {
    const contract = new Contract(address, ERC20, library.getSigner());
    const fromAcc = contract.filters.Transfer(account, null);
    library.on(fromAcc, (from, to, amount, event) => {
      console.log('Transfer|sent', { from, to, amount, event });
      mutate(undefined, true);
    });
    const toAcc = contract.filters.Transfer(null, account);
    library.on(toAcc, (from, to, amount, event) => {
      console.log('Transfer|received', { from, to, amount, event });
      mutate(undefined, true);
    });

    return () => {
      library.removeAllListeners(fromAcc);
      library.removeAllListeners(toAcc);
    };
  },[]);

  if(!balance) {
    return <Table.Body>...</Table.Body>
  }
  return (
  <Table.Body>
    <Table.Cell textAlign='center'>{symbol}</Table.Cell>
    <Table.Cell textAlign='center'>{parseFloat(formatUnits(balance, decimals)).toPrecision(4)}</Table.Cell>
  </Table.Body>);
}


/*
export const Wallet = () => {
  const { chainId, account, activate, active } = useWeb3React();

  const onClick = () => {
    activate(injectedConnector);
  }

  return (
    <div>
      <h4>USER ACCOUNT</h4>
      {active ? (
        <div>
          <div>ChainId: {chainId}</div>
          <div>Account: {account}</div>   
        </div>
      ) : (
        <Button primary onClick={onClick}>
          Connect To MetaMask
        </Button>
      )}
      {active && 
      <>
        <Balance />
        <TokenList chainId={chainId} />
      </>
      }
    </div>
  )
}
*/
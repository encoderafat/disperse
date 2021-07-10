import React, {useState} from 'react';
import { ethers } from "ethers";
import { BigNumber } from "bignumber.js";
import { Form, TextArea, Input, Button, Grid, Divider, Header } from 'semantic-ui-react';
import { useWeb3React } from '@web3-react/core';
import { injectedConnector } from '../web3/connectors';
import disperse from '../contracts/Disperse.json';
import ERC20 from '../contracts/erc20.json';
import { DISPERSEABI } from '../assets/disperse';

const UNIT = 1000000000000000000;
const address = DISPERSEABI.iotexTestnet;

const Tokens = () => {
    const [textValue, setTextValue] = useState('');
    const [tokenAddress,setTokenAddress] = useState('');
    const [disableDisperse,setDisableDisperse] = useState(true);
    const [disableApprove,setDisableApprove] = useState(false);
    const [addressArray,setAddressArray] = useState([]);
    const [amountArray, setAmountArray] = useState([]);

    const { chainId, account, activate, active } = useWeb3React();
    const ph = "0x314ab97b76e39d63c78d5c86c2daf8eaa306b182 3.141592\n"+
    "0x271bffabd0f79b8bd4d7a1c245b7ec5b576ea98a,2.7182\n"+
    "0x141ca95b6177615fb1417cf70e930e102bf8f584:1.41421";

    const onButtonClick = () => {
        activate(injectedConnector);
    }

    const handleChange = (e) => {
        setTextValue(e.target.value);
    }

    const handleInput = (e) => {
        setTokenAddress(e.target.value);
    }

    const handleTokenCalls = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
    }

    const handleApprove = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        let tempArray = textValue.valueOf().split(/[\s,;:\t\r\n]+/);

        let oddArray = tempArray.filter((v,i) => i%2);
        let evenArray = tempArray.filter((v,i) => !(i%2));

        let addArray = [];
        let amtArray = [];
        let total = 0.0;

        for (let i = 0; i < evenArray.length; ++i) {
            if (!isNaN(oddArray[i]) && (parseFloat(oddArray[i]) > 0.0 )) {
            addArray.push(evenArray[i].trim());
            amtArray.push(('0x'+(oddArray[i]*UNIT).toString(16)));
            total += parseFloat(oddArray[i]);
            }
        }

        setAddressArray(addArray);
        setAmountArray(amtArray);

        const erc20Contract = new ethers.Contract(tokenAddress, ERC20, provider);
        const erc20Signed = erc20Contract.connect(signer);

        console.log(total);

        let allowance = new BigNumber(total);
        
        allowance = allowance.multipliedBy(UNIT);
        console.log(allowance.toString());
        console.log(tokenAddress);
        console.log(addArray);
        console.log(amtArray);

        const toHex = '0x' + allowance.toString(16);

        const success = await erc20Signed.approve(address,toHex);

        setDisableDisperse(false);

        //let tx = await disperseSigned.disperseToken(tokenAddress,addArray,amtArray);

    }

    const handleDisperse = async () => {
        setDisableApprove(true);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const disperseContract = new ethers.Contract(address,disperse.abi,provider);
        const disperseSigned = disperseContract.connect(signer);

        if ((addressArray.length === amountArray.length) && addressArray.length > 0) {
            let tx = await disperseSigned.disperseToken(tokenAddress,addressArray,amountArray);
        } else {
            alert("Please enter at least one valid transaction");
        }

        setAddressArray([]);
        setAmountArray([]);
        setDisableApprove(false);
        setDisableDisperse(true);
    }

    if ((chainId === 97 || chainId === 4690) && active) {
        return(
            <Grid>
                <Grid.Row>
                    <Grid.Column width={3}>
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Form>
                            <Form.Field>
                                <Header as='h2'>
                                    <Header.Content>Disperse Tokens</Header.Content>
                                </Header>
                            </Form.Field>
                            <Form.Field>
                                <Input 
                                focus 
                                placeholder="Enter ERC20 Contract Address" 
                                onChange={handleInput}
                                />
                            </Form.Field>
                            <Divider />
                            <Form.Field>
                                <p>Please enter each address in a new line followed by a separator (comma,colon or blank space) and then the amount.</p>
                            </Form.Field>
                            <Divider />
                            <Form.Field>
                                <TextArea 
                                focus
                                placeholder={ph}
                                onChange={handleChange}
                                />
                            </Form.Field>
                            <Divider />
                            <Form.Field>
                                <Button basic color='green' onClick={async () => handleApprove()} disabled={disableApprove}>Approve</Button>
                                <Button basic color='green' onClick={async () => handleDisperse()} disabled={disableDisperse}>Disperse</Button>
                            </Form.Field>   
                        </Form>
                    </Grid.Column>
                    <Grid.Column width={3}>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    } else {
        return(
            <Grid>
                <Grid.Row>
                    <Grid.Column width={3}>
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Grid.Row>
                            {!(chainId === 97 || chainId === 4690) ?
                            <div><p>This DAPP only supports Binance Testnet(Chain ID : 97) and IOTEX Testnet ( Chain ID : 4690)</p></div>
                            : <div></div>}
                        </Grid.Row>
                        <Grid.Row>
                        {!active ? <Button basic color='green' onClick={onButtonClick}>
                                Connect To MetaMask
                            </Button> : <div></div> }
                        </Grid.Row>
                    </Grid.Column>
                    <Grid.Column width={3}>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

export default Tokens;
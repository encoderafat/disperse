import React,{useState} from 'react';
import {Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';


const Toolbar = () => {
    const [activeItem,setActiveItem] = useState('DEX');

    const menuClick = (e) => {
        //setActiveItem({name});
        //console.log(e);
    }
    return (
        <Menu pointing secondary>
        <Menu.Item as={ Link }
          name='Disperse DAPP'
          onClick={menuClick}
          to="/"
        />
        <Menu.Menu position='right'>
          <Menu.Item as={ Link }
            name='Disperse Currency'
            onClick={menuClick}
            to="/Native"
          />
          <Menu.Item as={ Link }
            name='Disperse Tokens'
            onClick={menuClick}
            to="/Tokens"
          />
        </Menu.Menu>
      </Menu>
    )
}

export default Toolbar;
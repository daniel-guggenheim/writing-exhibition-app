'use strict';

import React from 'react';
import { AppRegistry } from 'react-native';
import AppSetup from './AppSetup';

/* Remove logs in production */
if (!__DEV__) {
    console = {};
    console.log = () => { };
    console.error = () => { };
}

class App extends React.Component {
    render() {
        return (<AppSetup />);
    }
}

AppRegistry.registerComponent('SalonEcritureApp', () => App);

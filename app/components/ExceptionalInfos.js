'use strict';

import React, { Component, PropTypes } from 'react';
import { StyleSheet, View, } from 'react-native';
import { Card, CardItem, Icon, H3, Text, } from 'native-base';

import GLOBAL from '../global/GlobalVariables';

const propTypes = {
    title: React.PropTypes.string,
    text: React.PropTypes.string,
};

const defaultProps = {
    title: "",
    text: ""
};


class ExceptionalInfos extends Component {

    render() {
        let text = this.props.text;
        let title = this.props.title;

        if (text == "" || title == "") {
            return null;
        } else {
            return (
                <Card>
                    <CardItem header style={styles.titleCard}>
                        <Icon name="ios-information-circle" style={styles.icon} />
                        <H3 style={styles.titleText}>{title}</H3>
                    </CardItem>
                    <CardItem>
                        <Text>{text}</Text>
                    </CardItem>
                </Card>
            );
        }
    }
}

const styles = StyleSheet.create({
    titleCard: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleText: {
        textAlign: 'left',
        paddingBottom: 4,
    },
    icon: {
        color: 'green',
        fontSize: 30,
        marginRight: 8,
    },
});


ExceptionalInfos.propTypes = propTypes;
ExceptionalInfos.defaultProps = defaultProps;

export default ExceptionalInfos;
import React, { Component, PropTypes } from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import {Icon, H2, Text, Card, CardItem, } from 'native-base';

var GLOBAL = require('../global/GlobalVariables');

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
                        <H2 style={styles.titleText}>{title}</H2>
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
    },
    icon: {
        color: 'green',
        fontSize: 40,
        marginRight: 16,
    },
});


ExceptionalInfos.propTypes = propTypes;
ExceptionalInfos.defaultProps = defaultProps;

export default ExceptionalInfos;
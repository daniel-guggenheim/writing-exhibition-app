'use strict';

import React, { Component, PropTypes } from 'react';
import { BackAndroid, Image, Platform, StyleSheet, Text, View, } from 'react-native';
import { Button, Container, Content, Header, Icon, Title, } from 'native-base';

import myTheme from '../../themes/myTheme';
import GLOBAL from '../../global/GlobalVariables';

const PLACES_IMG_SRC_BY_ID = [
    require("../../images/lieux/colombier_centre.jpg"),
    require("../../images/lieux/echichens.jpg")
];

const SCHEDULE_COLOR = '#f1c40f';
const TYPE_COLOR = '#27ae60';
const LOCATION_COLOR = '#c0392b';


const propTypes = {
    goBackOneScene: PropTypes.func.isRequired,
    programmeElement: React.PropTypes.shape({
        duration: PropTypes.string,
        location: PropTypes.string,
        schedule: PropTypes.string,
        speaker: PropTypes.string,
        title: PropTypes.string,
        type: PropTypes.string,
    }).isRequired,
};

/**
 * Detailed view of a specific event / activity of the program. Additionnal information are
 * shown such as the speaker, the duration and a picture of the location.
 */
class ProgramDetailedView extends Component {

    componentDidMount() {
        //Add android back button listener
        if (Platform.OS === 'android') {
            BackAndroid.addEventListener('hardwareBackPress', this._handleAndroidBackButton);
        }
    }

    componentWillUnmount() {
        //Remove android back button listener
        if (Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', this._handleAndroidBackButton);
        }
    }

    /**
     * Activate the back button on android
     */
    _handleAndroidBackButton = () => {
        this.props.goBackOneScene();
        return true;
    }


    render() {
        const progElement = this.props.programmeElement;
        const locationId = GLOBAL.PLACES_ID(progElement.location);

        return (
            <Container theme={myTheme}>

                {/* --- Header --- */}
                <Header>
                    <Button transparent onPress={() => this.props.goBackOneScene()}>
                        <Icon name='ios-arrow-back' style={{ color: GLOBAL.TEXT_THEME_COLOR }} />
                    </Button>
                    <Title>Programme du Salon</Title>
                </Header>

                {/* --- Main --- */}
                <Content style={styles.content}>

                    {/* --- Title & Speaker --- */}
                    <Text style={styles.title}>{progElement.title}</Text>
                    { // If there is a speaker, show it
                        progElement.speaker &&
                        <Text style={styles.speaker}>{progElement.speaker}</Text>
                    }

                    {/* --- Info bloc --- */}
                    <View style={styles.infoBlocView}>

                        {/* - Schedule - */}
                        <View style={styles.infoElemView}>
                            <Icon name="ios-time" style={[styles.icon, { color: SCHEDULE_COLOR }]} />
                            <Text style={[styles.infoElemText, styles.schedule]}>
                                {progElement.schedule}
                            </Text>
                            { // If there is a duration, show it
                                progElement.duration &&
                                <Text style={styles.duration}>
                                    - (Durée: {progElement.duration})
                                </Text>
                            }
                        </View>

                        {/* - Category - */}
                        <View style={styles.infoElemView}>
                            <Icon name='ios-pricetag' style={[styles.icon, { color: TYPE_COLOR }]} />
                            <Text style={styles.infoElemText}>{progElement.type}</Text>
                        </View>

                        {/* - Location - */}
                        <View style={styles.infoElemView}>
                            <Icon name='ios-pin' style={[styles.icon, styles.iconPin]} />
                            <Text style={[styles.infoElemText,]}>{progElement.location}</Text>
                        </View>
                    </View>

                    {/* --- Location picture --- */}
                    <View style={styles.imageContainer}>
                        <Image
                            resizeMode="contain"
                            style={styles.placeImage}
                            source={PLACES_IMG_SRC_BY_ID[locationId]}
                        />
                    </View>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        marginTop: 8,
        marginBottom: 8,
        paddingRight: 16,
        paddingLeft: 16,
    },
    title: {
        fontSize: (Platform.OS === 'ios') ? 17 : 20,
        color: 'black',
        fontWeight: 'bold',
    },
    speaker: {
        color: 'black',
        fontSize: (Platform.OS === 'ios') ? 15 : 18,
        marginTop: 8,
    },
    infoBlocView: {
        marginTop: 32,
    },
    infoElemView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoElemText: {
        color: 'black',
        fontSize: (Platform.OS === 'ios') ? 15 : 18,
    },
    schedule: {
        marginRight: 8,
    },
    duration: {
        color: 'black',
        fontStyle: 'italic',
        fontSize: (Platform.OS === 'ios') ? 15 : 18,
    },
    icon: {
        marginRight: 12,
        textAlign: 'center',
        fontSize: 25,
        height: 25,
        width: 28,
    },
    iconPin: {
        fontSize: 28,
        height: 28,
        width: 28,
        color: LOCATION_COLOR,
    },
    imageContainer: {
        flex: 1,
    },
    placeImage: {
        flex: 1,
        width: null,
        height: 140,
    },
});

ProgramDetailedView.propTypes = propTypes;

export default ProgramDetailedView;
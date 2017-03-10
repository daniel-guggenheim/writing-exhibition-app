'use strict';

import React, { Component, PropTypes } from 'react';
import { Platform, StyleSheet, Text, View, } from 'react-native';
import { Card, CardItem, H2, Icon, } from 'native-base';

import GLOBAL from '../../global/GlobalVariables';

const COLLEGE_COLOMBIER_COLOR = '#1F3A93';

const propTypes = {
    progElem: PropTypes.shape({
        location: PropTypes.string,
        organizer: PropTypes.string,
        title: PropTypes.string,
    }).isRequired
};

/**
 * Contains the view for a single permanent exhibition of the program.
 */
class ProgramExhibitionComponent extends Component {

    render() {
        const progElem = this.props.progElem;
        const placeColor = GLOBAL.PLACES_COLOR(progElem.location);

        return (
            <CardItem>
                <View>
                    <Text style={styles.titleText}>{progElem.title}</Text>
                    <Text style={styles.expoPermaOrganizerText}>{progElem.organizer}</Text>
                    <View style={styles.expoPermaLocationView}>
                        <View style={styles.locationView}>
                            <Icon name='ios-pin-outline' style={[styles.locationIcon, { color: COLLEGE_COLOMBIER_COLOR, }]} />
                            <Text style={[styles.locationText, { color: COLLEGE_COLOMBIER_COLOR }]}>{progElem.location}</Text>
                        </View>
                    </View>
                </View>
            </CardItem>
        );
    }
}

const styles = StyleSheet.create({
    titleText: {
        flex: 1,
        flexWrap: 'wrap',
        fontSize: (Platform.OS === 'ios') ? 15 : 17,
        color: 'black',
    },
    locationView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    locationIcon: {
        fontSize: (Platform.OS === 'ios') ? 16 : 16,
        marginRight: 5,
    },
    locationText: (Platform.OS === 'ios') ?
        {
            flex: 1,

            fontSize: 12,
        }
        :
        {
            flex: 1,
        },
    expoPermaLocationView: {
        marginTop: (Platform.OS === 'ios') ? 10 : 8,
    },
    expoPermaOrganizerText: (Platform.OS === 'ios') ?
        {
            color: "rgba(86,86,86,1)",
            fontSize: (Platform.OS === 'ios') ? 13 : 15,
            marginTop: 4,
        }
        :
        {
            fontSize: 15,
            marginTop: 4,
        }
    ,
});


ProgramExhibitionComponent.propTypes = propTypes;

export default ProgramExhibitionComponent;
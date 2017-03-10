'use strict';

import React, { Component, PropTypes } from 'react';
import { Platform, StyleSheet, Text, View, } from 'react-native';
import { Card, CardItem, H2, Icon, } from 'native-base';

import GLOBAL from '../../global/GlobalVariables';


const propTypes = {
    goToProgramDetailedView: PropTypes.func.isRequired,
    progElem: PropTypes.shape({
        location: PropTypes.string,
        schedule: PropTypes.string,
        speaker: PropTypes.string,
        title: PropTypes.string,
        type: PropTypes.string,
    }).isRequired
};

/**
 * Contains the view for a single event/activity of the program. Shows the basic information
 * and leads to the detailed page when clicked on it.
 */
class ProgramEventComponent extends Component {

    render() {
        const progElem = this.props.progElem;
        const placeColor = GLOBAL.PLACES_COLOR(progElem.location);

        return (
            <CardItem style={styles.cardItem} button onPress={() => this.props.goToProgramDetailedView()} >
                <View style={styles.progElemView}>

                    {/* --- Time info --- */}
                    <View style={styles.scheduleView}>
                        <Text style={styles.scheduleText}>{progElem.schedule}</Text>
                    </View>

                    {/* --- Other info --- */}
                    <View style={styles.infosView}>
                        <Text style={styles.titleText}>{progElem.title}</Text>

                        {/* --- Type and location --- */}
                        <View style={styles.typeLocationView}>
                            <View style={styles.locationView}>
                                <Icon name='ios-pin-outline' style={[styles.locationIcon, { color: placeColor }]} />
                                <Text style={[styles.locationText]}>{progElem.location}</Text>
                            </View>
                            <Text style={styles.typeText}>{progElem.type}</Text>
                        </View>

                    </View>

                </View>
            </CardItem>
        );
    }
}



const styles = StyleSheet.create({
    progElemView: {
        flexDirection: 'row',
        marginBottom: (Platform.OS === 'ios') ? 7 : 0,
    },
    scheduleView: {
        marginRight: (Platform.OS === 'ios') ? 12 : 8,
        alignItems: 'center',
    },
    scheduleText: {
        fontSize: (Platform.OS === 'ios') ? 14 : 16,
        fontWeight: 'bold',
        color: 'black',
    },
    titleText: {
        flex: 1,
        flexWrap: 'wrap',
        fontSize: (Platform.OS === 'ios') ? 15 : 17,
        color: 'black',
    },
    infosView: {
        flex: 1,
        flexDirection: 'column',
    },
    typeLocationView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: (Platform.OS === 'ios') ? 12 : 12,
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
            color: "rgba(86,86,86,1)",
            fontSize: 12,
        }
        :
        {
            flex: 1,
        },
    typeText: (Platform.OS === 'ios') ?
        {
            flex: 1,
            textAlign: 'right',
            marginLeft: 20,
            fontStyle: 'italic',
            color: "rgba(86,86,86,1)",
            fontSize: 12,
        }
        :
        {
            flex: 1,
            textAlign: 'right',
            marginLeft: 20,
            fontStyle: 'italic',
        },
});


ProgramEventComponent.propTypes = propTypes;

export default ProgramEventComponent;
'use strict';

import React, { Component, PropTypes } from 'react';
import { Platform, StyleSheet, } from 'react-native';
import { Card, CardItem, H2, } from 'native-base';

import ProgramEventComponent from './ProgramEventComponent';


const propTypes = {
    goToProgramDetailedView: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    titleColor: PropTypes.string.isRequired,
    dayEventList: PropTypes.arrayOf(
        PropTypes.shape({
            location: PropTypes.string,
            schedule: PropTypes.string,
            speaker: PropTypes.string,
            title: PropTypes.string,
            type: PropTypes.string,
        },
        )).isRequired,
};

class ProgramSingleDayView extends Component {

    render() {
        const titleColor = this.props.titleColor;
        const title = this.props.title;
        const dayEventList = this.props.dayEventList;

        return (
            <Card>
                <CardItem header style={[styles.cardTitle, { borderLeftColor: titleColor, }]}>
                    <H2 >{title}</H2>
                </CardItem>
                {(dayEventList).map((event, i) => {
                    let elemKey = event.schedule + event.title;
                    return (
                        <ProgramEventComponent
                            key={elemKey}
                            progElem={event}
                            goToProgramDetailedView={() => this.props.goToProgramDetailedView(event)} />
                    );
                })}
            </Card>
        );
    }
}



const styles = StyleSheet.create({
    cardTitle: {
        borderLeftWidth: 16,
        borderStyle: 'solid',
        paddingLeft: 16,
        paddingBottom: 14,
        paddingTop: 14,
    },
});

ProgramSingleDayView.propTypes = propTypes;

export default ProgramSingleDayView;
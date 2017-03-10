'use strict';

import React, { Component, PropTypes } from 'react';
import { Platform, StyleSheet, } from 'react-native';
import { Card, CardItem, H2, } from 'native-base';

import ProgramEventComponent from './ProgramEventComponent';
import ProgramExhibitionComponent from './ProgramExhibitionComponent';

const propTypes = {
    goToProgramDetailedView: PropTypes.func,
    title: PropTypes.string.isRequired,
    titleColor: PropTypes.string.isRequired,
    dayEventList: PropTypes.arrayOf(PropTypes.object).isRequired,
    isExhibition: PropTypes.bool
};

const defaultProps = {
    isExhibition: false,
};

/**
 * This view display the program for a single day. It will show a list of event that happened 
 * during the day {dayEventList} .
 * This view can also be used to show the list of exhibition, which can be notified by setting
 * {isExhibition} to true in the props of the class.
 */
class ProgramSingleDayView extends Component {

    render() {
        const titleColor = this.props.titleColor;
        const title = this.props.title;
        const dayEventList = this.props.dayEventList;
        const isExhibition = this.props.isExhibition;

        return (
            <Card style={this.props.style}>
                <CardItem header style={[styles.cardTitle, { borderLeftColor: titleColor, }]}>
                    <H2 >{title}</H2>
                </CardItem>

                {/* It goes through the list and display each event:*/}
                {(dayEventList).map((event, i) => {
                    let elemKey = event.schedule + event.title;

                    if (isExhibition) {
                        {/* Displays a single exhibition */ }
                        return (
                            <ProgramExhibitionComponent
                                key={elemKey}
                                progElem={event}
                            />
                        );
                    } else {
                        {/* Displays a single event/activity */ }
                        return (
                            <ProgramEventComponent
                                key={elemKey}
                                progElem={event}
                                goToProgramDetailedView={
                                    () => this.props.goToProgramDetailedView(event)
                                }
                            />
                        );
                    }
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


ProgramSingleDayView.defaultProps = defaultProps;
ProgramSingleDayView.propTypes = propTypes;

export default ProgramSingleDayView;
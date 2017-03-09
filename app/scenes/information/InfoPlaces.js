'use strict';

import React, { Component, PropTypes } from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';
import { Button, Card, CardItem, Col, Grid, H2, Icon, Row, Text, } from 'native-base';

import FontAwesomeIconTheme from '../../themes/FontAwesomeIconTheme';
import MaterialDesignTheme from '../../themes/MaterialDesignTheme';

// Images
const PLACES_IMG_SRC_BY_ID = [
    require("../../images/lieux/colombier_centre.jpg"),
    require("../../images/lieux/college_colombier.jpg"),
    require("../../images/lieux/echichens.jpg")
];

const propTypes = {
    lieux: PropTypes.arrayOf(
        PropTypes.shape({
            addr1: PropTypes.string,
            name: PropTypes.string,
            gps_addr: PropTypes.string,
        },
        )).isRequired,
    clickUrl: PropTypes.func.isRequired,
};

/**
 * This component contains the information about the different places of the event.
 */
class InfoPlaces extends Component {

    render() {
        let lieux = this.props.lieux;
        let clickUrl = this.props.clickUrl;

        return (
            <Card>
                <CardItem header>
                    <Icon theme={FontAwesomeIconTheme} name="map-signs" style={{ fontSize: 30, marginRight: 8, }} />
                    <H2>Lieux</H2>
                </CardItem>

                {(lieux).map((lieu, i) => {
                    return (
                        <CardItem key={i}>
                            <Grid selectable={true}>
                                <Row>
                                    <Image style={styles.lieuImage} source={PLACES_IMG_SRC_BY_ID[i]} />
                                </Row>
                                <Row>
                                    <Text selectable={true} style={styles.lieuName}>{lieu.name}</Text>
                                </Row>
                                <Row>
                                    <Col>
                                        <Text selectable={true} style={styles.lieuAddr}>{lieu.addr1}</Text>
                                    </Col>
                                    <View style={styles.lieuItineraryView}>
                                        <Button success iconRight onPress={() => clickUrl(lieu.gps_addr)}>
                                            Itinéraire
                                            <Icon theme={MaterialDesignTheme} name="directions" />
                                        </Button>
                                    </View>
                                </Row>
                            </Grid>
                        </CardItem>
                    );
                })}
            </Card>
        );
    }
}


const styles = StyleSheet.create({
    lieuName: {
        fontSize: (Platform.OS === 'ios') ? 14 : 16,
        fontWeight: 'bold',
        marginTop: (Platform.OS === 'ios') ? 5 : 0,
    },
    lieuAddr: {
        marginTop: (Platform.OS === 'ios') ? 1 : 0,
        lineHeight: 20,
    },
    lieuImage: {
        flex: 1,
        width: 50,
        height: 130,
        resizeMode: 'contain'
    },
    lieuItineraryView: {
        justifyContent: 'center',
        marginLeft: 16,
        marginRight: 0,
    },
});


InfoPlaces.propTypes = propTypes;

export default InfoPlaces;
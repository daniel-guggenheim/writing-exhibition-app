'use strict';

import React, { Component } from 'react';
import { Platform, StyleSheet, } from 'react-native';
import { Card, CardItem, H2, Icon, Text, } from 'native-base';

/**
 * This component contains the schedule informations.
 */
class InfoSchedule extends Component {

    render() {
        return (
            <Card>
                <CardItem header>
                    <Icon name="ios-clock" style={{ fontSize: 30, marginRight: 8, }} />
                    <H2>Horaires</H2>
                </CardItem>

                <CardItem>
                    <Text style={styles.horairesDate}>
                        <Text style={styles.horairesHeure}>Jeudi 2 mars :</Text> 20h00
                        </Text>
                    <Text style={styles.horairesDate}>Conférence inaugurale</Text>
                    <Text note style={styles.horairesLieu}>(Salle polyvalente d’Echichens)</Text>
                </CardItem>

                <CardItem>
                    <Text>
                        <Text style={styles.horairesHeure}>Vendredi 3 mars : </Text>
                        <Text style={styles.horairesDate}>09h00 à 21h00</Text>
                    </Text>
                    <Text note style={styles.horairesLieu}>(Sur les trois sites)</Text>
                </CardItem>

                <CardItem>
                    <Text>
                        <Text style={styles.horairesHeure}>Samedi 4 mars : </Text>
                        <Text style={styles.horairesDate}>09h00 à 17h00</Text>
                    </Text>
                    <Text note style={styles.horairesLieu}>(Sur les trois sites)</Text>
                </CardItem>
            </Card>
        );
    }
}


const styles = StyleSheet.create({

    horairesDate: {
        fontSize: (Platform.OS === 'ios') ? 14 : 16,
    },
    horairesHeure: {
        fontSize: (Platform.OS === 'ios') ? 14 : 16,
        fontWeight: 'bold',
        margin: 0,
        padding: 0,
    },
    horairesLieu: (Platform.OS === 'ios') ? {
        fontSize: 14,
        fontWeight: 'normal',
        marginTop: 3,
        marginBottom: 5,
    } : {},
});

export default InfoSchedule;
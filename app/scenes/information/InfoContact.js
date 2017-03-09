'use strict';

import React, { Component, PropTypes } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Button, Icon, H2, Text, Card, CardItem, } from 'native-base';

import GLOBAL from '../../global/GlobalVariables';

const SALON_ECRITURE_WEBSITE_ADDR = 'http://www.salonecriture.org';

const propTypes = {
    clickUrl: PropTypes.func.isRequired,
};

/**
 * This component contains the information about the organizers of the events and how to contact
 * them.
 */
class InfoContact extends Component {

    render() {
        let clickUrl = this.props.clickUrl;

        return (
            <Card>
                <CardItem header>
                    <Icon name="md-people" style={{ fontSize: 30, marginRight: 8, }} />
                    <H2>Contacts</H2>
                </CardItem>

                <CardItem>
                    <Text selectable={true}>
                        <Text style={styles.contactTitle}>Site internet : </Text>
                        <Text style={styles.url} onPress={() => clickUrl(SALON_ECRITURE_WEBSITE_ADDR)}>
                            www.salonecriture.org
                        </Text>
                    </Text>
                    <Text selectable={true}>
                        <Text style={styles.contactTitle}>Email : </Text>
                        <Text style={styles.url} onPress={() => clickUrl(GLOBAL.SEND_EMAIL_URI_SALON_ECRITURE)}>
                            info@salonecriture.org
                </Text>
                    </Text>
                </CardItem>

                <CardItem>
                    <View style={{ marginBottom: 8, }}>
                        <Text style={styles.contactTitle}>Présidente du Salon : </Text>
                        <Text selectable={true}>Sylvie Guggenheim</Text>
                    </View>
                    <View style={{ marginBottom: 8, }}>
                        <Text style={styles.contactTitle}>Vice-président du Salon : </Text>
                        <Text selectable={true}>Michel Ackermann</Text>
                    </View>
                    <View>
                        <Text style={styles.contactTitle}>Organisateur du Salon : </Text>
                        <Text selectable={true}>Association SylMa</Text>
                    </View>
                </CardItem>


                <CardItem>
                    <View>
                        <Text style={styles.contactTitle}>Créateur de l'application mobile : </Text>
                        <Text>Daniel Guggenheim</Text>
                    </View>
                </CardItem>

                <CardItem>
                    <Text style={styles.bugText}>
                        Si vous découvrez un bug en utilisant cette application, merci de
                        le signaler en cliquant ici :
                    </Text>
                    <View style={{ marginTop: 8, flexDirection: 'row', justifyContent: 'center' }}>
                        <Button warning bordered
                            onPress={() => clickUrl(GLOBAL.SEND_EMAIL_URI_REPORT_BUG)}>
                            <Icon name='ios-mail' />
                            <Text>Signaler un bug</Text>
                        </Button>
                    </View>
                </CardItem>
            </Card>
        );
    }
}


const styles = StyleSheet.create({
    contactTitle: {
        fontSize: (Platform.OS === 'ios') ? 14 : 16,
        fontWeight: 'bold',
    },
    url: {
        textDecorationLine: 'underline',
        color: '#0000EE',
    },
    bugText: (Platform.OS === 'ios') ? {
        fontSize: 14,
    } : {},
});


InfoContact.propTypes = propTypes;

export default InfoContact;
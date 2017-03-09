'use strict';

import React, { Component, PropTypes } from 'react';
import { Platform, StyleSheet, } from 'react-native';
import { Card, CardItem, H2, Icon, Text, } from 'native-base';

// Local variables
const PRACTICAL_INFO_WEBPAGE_ADDR = 'https://www.salonecriture.org/salon/infos-pratiques/';

const propTypes = {
  clickUrl: PropTypes.func.isRequired,
};

/**
 * This scene contains all the useful information about the access by car or bus to the event.
 */
class InfoAccess extends Component {

  render() {
    let clickUrl = this.props.clickUrl;

    return (
      <Card>
        <CardItem header>
          <Icon name="md-car" style={{ fontSize: 30, marginRight: 8, }} />
          <H2>Accès au Salon</H2>
        </CardItem>

        <CardItem>
          <Text style={styles.accesTitle}>En voiture :</Text>
          <Text style={styles.accesText} selectable={true}>
            Sortie d’autoroute à Morges. Depuis là, 5 minutes de trajet jusqu’à
            Echichens et 5 minutes de plus pour Colombier VD.
          </Text>
        </CardItem>

        <CardItem>
          <Text style={styles.accesTitle}>En transports publics :</Text>
          <Text style={styles.accesText}>Arrêt à la gare de Morges. Par la suite, à choix:</Text>
          <Text style={styles.accesText}>- Centre d'Echichens: bus de ligne 701.</Text>
          <Text style={styles.accesText}>- Colombier: bus de ligne 730.</Text>
          <Text style={styles.accesText}>
            - Navette du salon jusqu'à Echichens (1er arrêt) et Colombier VD (2ème et 3ème arrêts).
            Le vendredi toutes les heures, le samedi toutes les 30 minutes.
          </Text>
        </CardItem>

        <CardItem style={styles.cardItemInfoSup}>
          <Icon name="ios-information-circle" style={{ color: 'green', fontSize: 30, marginRight: 8, }} />
          <Text selectable={true} style={styles.infoSupp}>
            Les horaires sont disponibles sur le site internet à l'adresse suivante:
            <Text style={styles.url} onPress={() => clickUrl(PRACTICAL_INFO_WEBPAGE_ADDR)}>
              {' ' + PRACTICAL_INFO_WEBPAGE_ADDR}
            </Text>
          </Text>
        </CardItem>
      </Card>
    );
  }
}


const styles = StyleSheet.create({
  accesTitle: {
    fontSize: (Platform.OS === 'ios') ? 14 : 16,
    fontWeight: 'bold',
  },
  accesText: (Platform.OS === 'ios') ? {
    fontSize: 14,
  } : {},
  infoSupp: {
    fontSize: (Platform.OS === 'ios') ? 14 : 16,
    fontStyle: 'italic',
  },
  url: {
    textDecorationLine: 'underline',
    color: '#0000EE',
  },
  cardItemInfoSup: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});


InfoAccess.propTypes = propTypes;

export default InfoAccess;
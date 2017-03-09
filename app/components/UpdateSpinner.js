'use strict';

import React, { Component, PropTypes } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Text } from 'native-base';

const propTypes = {
    loading: PropTypes.bool.isRequired,
};


class UpdateSpinner extends Component {

    render() {
        return (
            <View>
                {this.props.loading ?
                    <View style={styles.loadingContent}>
                        <Text>Mise-à-jour</Text>
                        <ActivityIndicator style={styles.spinner} />
                    </View>
                    : null
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    loadingContent: {
        alignItems: 'center',
        marginBottom: 8,
    },
    spinner: {
        marginTop: 6,
    },
});

UpdateSpinner.propTypes = propTypes;

export default UpdateSpinner;
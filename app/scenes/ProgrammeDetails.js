
import React, { Component, PropTypes } from 'react';
import {
    StyleSheet,
    Text,
    View,
    WebView,
    BackAndroid
} from 'react-native';
import {
    Spinner, Container, Header, Title, Content, Button, Icon, Card, CardItem, H3,
    Grid, Row, Col
} from 'native-base';
import myTheme from '../themes/myTheme';

var GLOBAL = require('../global/GlobalVariables');

const propTypes = {
    article_infos: React.PropTypes.shape({
        category: PropTypes.string,
        date: PropTypes.string,
        id: PropTypes.number,
        intro: PropTypes.string,
        title: PropTypes.string,
    }),
    article_html: PropTypes.string,
};

const progElemTest = {
    location: 'Colombier, C1',
    schedule: '10h00',
    speaker: "Emmanuelle Ryser, Ecrivain public, Collectif D.I.R.E.",
    title: "Je me souviens, atelier d'écriture autobiographique",
    type: 'Atelier',
    duration: '1h',
}

const expoTest = {
    location: "Collège de Colombier",
    organizer: "Fondation Bodmer, Genève",
    title: "Alphabet a ka u ku du Sultan Njoya, roi des Bamoun (Hôte d'honneur, Cameroun)",
}

const defaultProps = {
};

class ProgrammeDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            start: true,
        };
    }

    componentDidMount() {
        //Add android back button listener
        BackAndroid.addEventListener('hardwareBackPress', this._handleAndroidBackButton);
        this.setState({ start: false });
    }

    componentWillUnmount() {
        //Remove android back button listener
        BackAndroid.removeEventListener('hardwareBackPress', this._handleAndroidBackButton);
    }

    _handleAndroidBackButton = () => {
        this.props.goBackOneScene();
        return true;
    }

    render() {
        let progElement = this.props.programmeElement;
        // let progElement = progElemTest;
        // console.log(progElement);
        return (
            <Container theme={myTheme}>
                <Header>
                    <Button transparent onPress={() => this.props.goBackOneScene()}>
                        <Icon name='ios-arrow-back' />
                    </Button>
                    <Title>Programme du Salon</Title>
                </Header>
                <Content style={styles.content}>

                    <Text style={styles.title}>{progElement.title}</Text>
                    {progElement.duration && <Text style={styles.speaker}>{progElement.speaker}</Text>}
                    <View style={styles.infoBlocView}>
                        <View style={styles.infoElemView}>
                            <Icon name="ios-time-outline" style={styles.icon} />
                            <Text style={[styles.infoElemText, styles.schedule]}>{progElement.schedule}</Text>
                            {progElement.duration && <Text style={styles.duration}>(Durée approximative: {progElement.duration})</Text>}

                        </View>
                        <View style={styles.infoElemView}>
                            <Icon name='ios-pin-outline' style={styles.icon} />
                            <Text style={styles.infoElemText}>{progElement.location}</Text>
                        </View>
                        <View style={styles.infoElemView}>
                            {/* ios-albums ios-book ios-folder  ios-pricetag ios-pricetags ios-bookmark-outline*/}
                            <Icon name='ios-pricetag-outline' style={styles.icon} />
                            <Text style={styles.infoElemText}>{progElement.type}</Text>
                        </View>
                    </View>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    /* --- Main view --- */
    content: {
        marginTop: 8,
        marginBottom: 8,
        paddingRight: 16,
        paddingLeft: 16,
    },


    title: {
        fontSize: 22,
        color: 'black',
        fontWeight: 'bold',
    },
    speaker: {
        color: 'black',
        fontSize: 20,
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
        fontSize: 20,
    },
    schedule: {
        marginRight: 8,
    },
    duration: {
        color: 'black',
        fontStyle: 'italic',
        fontSize: 18,
    },
    icon: {
        marginRight: 12,
        fontSize: 25,
        height: 25,
        width: 25,
        textAlign: 'center',
    },
});

ProgrammeDetails.propTypes = propTypes;
ProgrammeDetails.defaultProps = defaultProps;

export default ProgrammeDetails;
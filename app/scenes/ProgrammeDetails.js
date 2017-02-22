
import React, { Component, PropTypes } from 'react';
import {
    StyleSheet,
    Text,
    View,
    WebView,
    BackAndroid,
    Image,
} from 'react-native';
import {
    Spinner, Container, Header, Title, Content, Button, Icon, Card, CardItem, H3,
    Grid, Row, Col
} from 'native-base';
import myTheme from '../themes/myTheme';

var GLOBAL = require('../global/GlobalVariables');

var lieux_images_sources_by_id = [
    require("../images/lieux/colombier_centre.jpg"),
    require("../images/lieux/echichens.jpg")
];

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
        let locationId = GLOBAL.PLACES_ID(progElement.location);
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
                            <Icon name="ios-time" style={[styles.icon, { color: '#f1c40f' }]} />
                            <Text style={[styles.infoElemText, styles.schedule]}>{progElement.schedule}</Text>
                            {progElement.duration && <Text style={styles.duration}>- ({progElement.duration})</Text>}

                        </View>
                        <View style={styles.infoElemView}>
                            {/* ios-albums ios-book ios-folder  ios-pricetag ios-pricetags ios-bookmark-outline*/}
                            <Icon name='ios-pricetag' style={[styles.icon, { color: '#27ae60' }]} />
                            <Text style={styles.infoElemText}>{progElement.type}</Text>
                        </View>
                        <View style={styles.infoElemView}>
                            <Icon name='ios-pin' style={[styles.icon, styles.iconPin]} />
                            <Text style={[styles.infoElemText, { color: GLOBAL.PLACES_COLOR(progElement.location) }]}>{progElement.location}</Text>
                        </View>
                    </View>
                    {/*<Image style={styles.lieuImage} source={lieux_images_sources_by_id[GLOBAL.PLACES_ID[progElement.location]]} />*/}
                    <View style={styles.imageContainer}>
                        <Image resizeMode="contain" style={styles.placeImage} source={lieux_images_sources_by_id[locationId]} />
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
        // backgroundColor:'white',
    },


    title: {
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold',
    },
    speaker: {
        color: 'black',
        fontSize: 18,
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
        fontSize: 18,
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
        marginRight: 16,
        fontSize: 25,
        height: 25,
        width: 28,
        textAlign: 'center',
        // backgroundColor:'orange'
    },
    iconPin: {
        fontSize: 28,
        height: 28,
        width: 28,
        color: '#c0392b',
    },
    imageContainer: {
        flex: 1,
        // backgroundColor:'blue',
        // flexDirection:'row',
        // alignItems: 'stretch',
    },
    placeImage: {
        flex: 1,
        width: null,
        height: 140,
    },
});

ProgrammeDetails.propTypes = propTypes;
ProgrammeDetails.defaultProps = defaultProps;

export default ProgrammeDetails;
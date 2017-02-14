import React, { Component, PropTypes } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    NetInfo,
    Navigator,
    TouchableHighlight,
    ScrollView,
    Image,
} from 'react-native';
import { Container, Header, Tabs, Title, Content, Footer, FooterTab, Button, Icon, Spinner } from 'native-base';

import Actualites from './Actualites';
import ProgrammeSalon from './ProgrammeSalon';
// import Plans from 'Plans';
import InformationsPratiques from './InformationsPratiques';
import MainTabBar from '../components/MainTabBar';
// import ActualitesDetails from 'ActualitesDetails';

import ScrollableTabView, { DefaultTabBar, } from 'react-native-scrollable-tab-view';



const propTypes = {
    actualitesArticlesInfos: React.PropTypes.arrayOf(
        React.PropTypes.shape({
            category: PropTypes.string,
            date: PropTypes.string,
            id: PropTypes.number,
            intro: PropTypes.string,
            title: PropTypes.string,
        }
        )),
    actualitesArticlesContent:React.PropTypes.arrayOf(PropTypes.string),
    fetchBackendToUpdateAll: React.PropTypes.func.isRequired,
    infosPratiquesStrings: React.PropTypes.shape({
        last_update: PropTypes.string,
        text1_dates: PropTypes.string,
        text2_horaires: PropTypes.string,
        lieux: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                addr1: PropTypes.string,
                name: PropTypes.string,
                gps_addr: PropTypes.string,
            }
            )),
    }).isRequired,
    actualiteArticlesIsLoading: React.PropTypes.bool.isRequired,
    goToActualitesDetails: React.PropTypes.func.isRequired,
};

const defaultProps = {
};


class MainTabView extends Component {
    render() {
        return (
            <ScrollableTabView
                style={{}}
                initialPage={1}
                renderTabBar={() => <MainTabBar />}
                tabBarPosition='bottom'
                tabBarBackgroundColor={'#E8E0C5'}
                initialPage={0}
            >

                <Actualites
                    tabLabel="ios-cafe"
                    articlesInfo={this.props.actualitesArticlesInfos}
                    articlesContent={this.props.actualitesArticlesContent}
                    fetchBackendToUpdateAll={this.props.fetchBackendToUpdateAll}
                    loading={this.props.actualiteArticlesIsLoading}
                    goToActualitesDetails={(article_info, article_html) => this.props.goToActualitesDetails(article_info, article_html)}
                />

                <ProgrammeSalon tabLabel="ios-list-box" />

                <InformationsPratiques
                    tabLabel="ios-information-circle"
                    textFieldsContent={this.props.infosPratiquesStrings}
                />

            </ScrollableTabView>
        );
    }
}




MainTabView.propTypes = propTypes;
MainTabView.defaultProps = defaultProps;

export default MainTabView;

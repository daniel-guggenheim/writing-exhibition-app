/**
 * Code coming from:
 * https://github.com/skv-headless/react-native-scrollable-tab-view/blob/master/examples/FacebookTabsExample/FacebookExample.js
 * and modified for the need of the project.
 */
'use strict';

import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import GLOBAL from '../global/GlobalVariables';


const ACTIVE_COLOR = [0, 34, 102];
const PASSIVE_COLOR = [189, 195, 199];
const rgb_color = (colArray) => `rgb(${colArray[0]}, ${colArray[1]}, ${colArray[2]})`;


const MainTabBar = React.createClass({
    tabIcons: [],
    tabText: [],

    propTypes: {
        goToPage: React.PropTypes.func,
        activeTab: React.PropTypes.number,
        tabs: React.PropTypes.array,
    },

    componentDidMount() {
        this._listener = this.props.scrollValue.addListener(this.setAnimationValue);
    },

    setAnimationValue({ value, }) {
        this.tabIcons.forEach((icon, i) => {
            const progress = Math.min(1, Math.abs(value - i))
            icon.setNativeProps({
                style: {
                    color: this.iconColor(progress),
                },
            });
            this.tabText[i].setNativeProps({
                style: {
                    color: this.iconColor(progress),
                },
            });
        });
    },

    iconColor(progress) {
        let exportColor = [0, 0, 0]
        for (let i = 0; i < 3; i++) {
            exportColor[i] = ACTIVE_COLOR[i] + (PASSIVE_COLOR[i] - ACTIVE_COLOR[i]) * progress
        }
        return rgb_color(exportColor);
    },

    render() {
        return <View style={[styles.tabs, this.props.style,]}>
            {this.props.tabs.map((tab, i) => {
                return (
                    <TouchableOpacity key={tab} style={styles.tab} onPress={() => this.props.goToPage(i)}>
                        <Icon
                            name={GLOBAL.MAIN_TAB_BAR.tabPictures[tab]}
                            size={28}
                            color={this.props.activeTab === i ? rgb_color(ACTIVE_COLOR) : rgb_color(PASSIVE_COLOR)}
                            ref={(icon) => { this.tabIcons[i] = icon; }}
                        />
                        <Text
                            style={styles.subtitles}
                            ref={(txt) => { this.tabText[i] = txt; }}
                        >
                            {GLOBAL.MAIN_TAB_BAR.tabNames[tab]}
                        </Text>
                        {/*<Icon name={tab} active={this.props.activeTab === i ? false: false} style={{color: rgb_color(ACTIVE_COLOR)}} />*/}
                    </TouchableOpacity>
                );
            })}
        </View>;
    },
});

const styles = StyleSheet.create({
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 5,
    },
    tabs: {
        height: (Platform.OS === 'ios' ) ? 60 : 55,
        flexDirection: 'row',
        backgroundColor: '#E8E0C5',
        paddingTop: 5,
        borderWidth: 1,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderTopColor: 'rgba(0,0,0,0.05)',

    },
    subtitles: {
        // color: 'black',
        fontSize: (Platform.OS === 'ios' ) ? 12 : 13,
    }
});

export default MainTabBar;
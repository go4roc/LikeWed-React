/**
 * 喜结婚礼汇酒店功能入口
 */

'use strict';

var React = require('react-native');

var HotelListScreen = require('./HotelListScreen');
var HotelScreen = require('./HotelScreen');
var QueryHotelScheduleScreen = require('./QueryHotelScheduleScreen');
var HotelIntroduceScreen = require('./HotelIntroduceScreen');
var HotelMenuScreen = require('./HotelMenuScreen');
var HotelHallScreen = require('./HotelHallScreen');

var {
    AppRegistry,
    Navigator,
} = React;

var Hotels = React.createClass({
    renderRouter(route, navigator) {
        console.info('route ...');
        console.info(route);

        switch(route.id) {
            case 'HotelList':
                return <HotelListScreen navigator={navigator} sort={route.sort} filter={route.filter} />
            case 'Hotel': 
                return <HotelScreen navigator={navigator} hotel={route.hotel} />;
            case 'QueryHotelSchedule':
                return <QueryHotelScheduleScreen navigator={navigator} hotel={route.hotel} />
            case 'HotelIntroduce':
                return <HotelIntroduceScreen navigator={navigator} hotel={route.hotel} />
            case 'HotelMenu':
                return <HotelMenuScreen navigator={navigator} hotel={route.hotel} menu={route.menu}/>
            case 'HotelHall':
                return <HotelHallScreen navigator={navigator} hotel={route.hotel} hall={route.hall}/>
        }
    },

    render() {
        return (
            <Navigator
                ref="navigator"
                renderScene={this.renderRouter}
                initialRoute={{id: 'HotelList'}}
                configureScene={(route) => {
                    return Navigator.SceneConfigs.FloatFromRight
                }} />
        );
    }
});

module.exports = Hotels;

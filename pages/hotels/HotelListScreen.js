'use strict';

var React = require('react-native');
var NavigationBar = require('./components/NavigationBar');
var Icon = require('react-native-vector-icons/Ionicons');
var RefreshableListView = require('react-native-refreshable-listview');
var Modal   = require('react-native-modalbox');

var ReactViewController = require('NativeModules').ReactViewController;

var {
    StyleSheet,
    Text,
    Image,
    View,
    ScrollView,
    ListView,
    ActivityIndicatorIOS,
    TouchableOpacity
} = React;

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');

var HotelSortPicker = require('./components/HotelSortPicker');
var HotelFilterPicker = require('./components/HotelFilterPicker');

var styles = require('../../styles/HotelStyles');
var indicatorStyles = require('../../styles/IndicatorStyles');

//var HOTEL_LIST_API = "http://api.likewed.net/V1/hotels";
var HOTEL_LIST_API = "http://localhost:9928/V1/hotels";

var PAGE_SIZE = 10;

var HotelListScreen = React.createClass({
    resultsCache: {
        items: [],
        total: 0,
        nextPage: 1
    },

    getInitialState() {
        return {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
            loaded: false
        };
    },

    componentDidMount() {
        this.fetchTopicsData(HOTEL_LIST_API);
    },

    _loadMore() {
        this.fetchTopicsData(HOTEL_LIST_API);
    },

    _reload() {
        this.fetchTopicsData(HOTEL_LIST_API, true);
    },

    fetchTopicsData(api=this.props.resourceApi, reload) {
        var URL = api;
        if (!reload) {
            URL = URL+'?page='+this.resultsCache.nextPage;
        } 

        fetch(URL)
            .then(res => res.json())
            .then(data => {
                if (reload) this.resultsCache = { items: [], total: 0, nextPage: 1 };

                this.resultsCache.items.push(...data.items);
                this.resultsCache.total = data.total;
                this.resultsCache.nextPage += 1; 

                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.resultsCache.items),
                    loaded: true
                });
             })
            .catch(err => {
                console.info(err);
                alert('获取酒店数据错误');
            });
    },  

    renderNavbar() {
        return (
            <NavigationBar
                title={
                    <View style={styles.navbarCenter}>
                        <Text style={styles.navbarTitle}>婚宴酒店</Text>
                        <Text style={styles.navbarSubTitle}>{this.resultsCache.total}家酒店</Text>
                    </View>
                }
                leftButton={
                    <TouchableOpacity onPress={() => { ReactViewController.closeViewController(); } }>
                        <Icon name='ios-arrow-back' size={24} color='#e9573e' style={[{ marginLeft: 10, marginRight: 10, width: 24, height: 24, }, this.props.style]} />
                    </TouchableOpacity>
                }
                rightButton={
                    <TouchableOpacity onPress={() => this.props.navigator.push({id: 'ShareHotel', hotel: this.props.hotel})}>
                        <Icon name='ios-search' size={24} color='#e9573e' style={[{ marginLeft: 10, marginRight: 10, width: 24, height: 24, }, this.props.style]} />
                    </TouchableOpacity>
                } />
        )
    },

    renderFilterBar() {
        return (
            <View style={styles.filterbar}>
                <TouchableOpacity style={styles.filterbarItem} onPress={this.openSortPicker} >
                    <Icon name='ios-shuffle' size={24} color='#e9573e' style={[{ marginLeft: 10, marginRight: 10, width: 20, height: 20, }, this.props.style]} />
                    <Text style={styles.filterbarLabel}>排序</Text>
                </TouchableOpacity>
                <View style={[styles.separatorColor, {width: 1, height: 20}]} />
                <TouchableOpacity style={styles.filterbarItem} onPress={this.openFilterPicker} >
                    <Icon name='ios-settings' size={20} color='#e9573e' style={[{ marginLeft: 10, marginRight: 10, width: 20, height: 20, }, this.props.style]} />
                    <Text style={styles.filterbarLabel}>筛选</Text>
                </TouchableOpacity>
            </View>
        );
    },

    renderHotelRow(hotel) {
        var capacity = hotel.capacity.start === hotel.capacity.end ? hotel.capacity.start: hotel.capacity.start +'-' + hotel.capacity.end;

        return (
            <TouchableOpacity onPress={() => this.props.navigator.push({id: 'Hotel', hotel: hotel}) }>
                <View key={hotel._id} style={{flexDirection: 'row', paddingTop: 12, paddingBottom:12, paddingLeft:10, paddingRight: 10, borderBottomWidth:1, borderColor: "#E1E1E1"}}>
                    <Image style={{width: 120, height: 88, resizeMode: Image.resizeMode.cover, }} source={{uri: hotel.pics[0].url+'!380x'}} />
                    <View style={{flex:1, paddingLeft: 8}}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{color: '#343434', fontWeight: "300", fontSize: 16}}>{hotel.name}</Text>
                        </View>
                        <View style={{flexDirection: 'row', marginTop: 8}}>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{color: '#FA7621', fontWeight: "300", fontSize: 14}}>{hotel.score}分</Text>
                                <Text style={{color: '#a7a7a7', fontWeight: "300", fontSize: 14}}>/{hotel.stats.reviews}评论</Text>
                            </View>
                            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', }} >
                                <Text style={{color: '#FA7621', fontWeight: "400", fontSize: 14}}><Text style={{color: '#FA7621', fontWeight: "300", fontSize: 9}}>¥</Text>{hotel.price.start}-{hotel.price.end}/桌</Text>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', marginTop: 8, }}>
                            <Text style={{marginRight: 8, color: '#a7a7a7', fontWeight: "300", fontSize: 13}}>{hotel.category}</Text>
                            <Text style={{marginRight: 8, color: '#a7a7a7', fontWeight: "300", fontSize: 13}}>{capacity}桌</Text>
                            <View style={{paddingTop: 2, flex:1, flexDirection: 'row', justifyContent: 'flex-end', }}>
                                <Text style={{paddingLeft:3, paddingRight: 3, borderRadius: 3, borderWidth:1, borderColor: '#FA7621', marginLeft: 8, color: '#FA7621', fontWeight: "300", fontSize: 9}}>订单返现</Text>
                                <Text style={{paddingLeft:3, paddingRight: 3, borderRadius: 3, borderWidth:1, borderColor: '#FA7621', marginLeft: 8, color: '#FA7621', fontWeight: "300", fontSize: 9}}>预约红包</Text>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', marginTop: 8, }}>
                            <View style={{flex:1}}>
                                <Text numberOfLines={1} style={{marginRight: 8, color: '#a7a7a7', fontWeight: "300", fontSize: 13}}>{hotel.location.district}・{hotel.location.description}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    },

    renderHotelList() {
        return (
            <RefreshableListView
                initialListSize={8}
                pageSize={8}
                onEndReached={this._loadMore}
                dataSource={ this.state.dataSource }
                renderRow={ this.renderHotelRow }
                style={styles.listContainer }
                removeClippedSubviews={true}
                onEndReachedThreshold={0}
                loadData={this._reload}
                refreshDescription='正在刷新...'
                refreshingIndictatorComponent={
                    <RefreshableListView.RefreshingIndicator stylesheet={ indicatorStyles } />
                }
                minDisplayTime={500}
                minPulldownDistance={80}
                minBetweenTime={2000} />
        )
    },

    openSortPicker(id) {
        this.refs.sortPicker.open();
    },

    openFilterPicker(id) {
        this.refs.filterPicker.open();
    },

    onSortSelected(id) {
        this.setState({loaded: false});

        var url = HOTEL_LIST_API+ "?sort="+id;
        this.fetchTopicsData(url, true);
    },

    onFilterChanged(id) {
        this.setState({loaded: false});

        var url = HOTEL_LIST_API+ "?sort="+id;
        this.fetchTopicsData(url, true);
    },

    render() {
        if (this.state.loaded) {
            return (
                <View style={styles.screen}>
                    { this.renderNavbar() }
                    { this.renderFilterBar() }
                    { this.renderHotelList() }
                    <HotelSortPicker ref="sortPicker" onSelected={ this.onSortSelected }/>
                    <HotelFilterPicker ref="filterPicker" onFilterChanged={ this.onFilterChanged }/>
                </View>
            );
        } else {
            return (
                <View style={styles.screen}>
                    { this.renderNavbar() } 
                    <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
                        <ActivityIndicatorIOS size="large"/>
                    </View>
                </View>
            );
        }
    },
});

module.exports = HotelListScreen;

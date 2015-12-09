'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Modal   = require('react-native-modalbox');

var styles = require('./styles');

var {
    Text,
    View,
    ScrollView,
    TouchableOpacity,
} = React;

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');

const Filters = [
    { 
        id:"category", 
        title: "类型", 
        multi: false,
        items: [
            { title: "不限", selected: true },
            { title: "五星级", selected: false },
            { title: "四星级", selected: false },
            { title: "特色餐厅", selected: false }
        ]
    }, 
    { 
        id:"district", 
        title: "区域", 
        multi: false,
        items: [
            { title: "不限", selected: true },
            { title: "武侯区", selected: false},
            { title: "金牛区", selected: false},
            { title: "青羊区", selected: false},
            { title: "锦江区", selected: false},
            { title: "高新区", selected: false},
            { title: "成华区", selected: false},
            { title: "近郊", selected: false},
            { title: "华阳区", selected: false},
            { title: "温江区", selected: false},
            { title: "新都区", selected: false},
            { title: "龙泉区", selected: false},
            { title: "都江堰", selected: false},
        ]
    }, 
    { 
        id:"price",    
        title: "价格", 
        multi: false,
        items: [
            { title: "不限", selected: true },
            { title: "2000元以下", selected: false},
            { title: "2000-3000", selected: false},
            { title: "3000-4000", selected: false},
            { title: "4000元以上", selected: false},
        ]
    }, 
    { 
        id:"capacity", 
        title: "桌数", 
        multi: false,
        items: [
            { title: "不限", selected: true },
            { title: "10桌以下", selected: false },
            { title: "10-20桌", selected: false },
            { title: "20-30桌", selected: false },
            { title: "30桌以上", selected: false }
        ]
    }, 
    { 
        id:"feature",  
        title: "特色", 
        multi: true,
        items: [
            { title: "不限", selected: true },
            { title: "草坪婚礼", selected: false },
            { title: "创意婚礼", selected: false },
            { title: "室外婚礼", selected: false },
            { title: "中式婚礼", selected: false },
            { title: "西式婚礼", selected: false },
            { title: "地铁沿线", selected: false },
            { title: "小型婚宴", selected: false },
            { title: "大厅无柱", selected: false },
            { title: "独立门面", selected: false },
            { title: "乐器伴奏", selected: false },
            { title: "酒水自带", selected: false },
            { title: "层高高", selected: false },
            { title: "落地玻璃", selected: false },
            { title: "露台仪式", selected: false },
            { title: "观景餐厅", selected: false },
            { title: "水晶吊灯", selected: false },
            { title: "个性婚礼", selected: false },
            { title: "教堂婚礼", selected: false },
            { title: "户外婚礼", selected: false },
            { title: "清真菜", selected: false },
            { title: "四合院", selected: false},
        ]
    }
];

var HotelFilterPicker = React.createClass({
    getInitialState: function() {
        return {
            data: Filters,
            selectedCategory: Filters[0].id,
        };
    },

    open() {
        this.refs.picker.open();
    },

    _close() {
        var data = {};

        this.refs.picker.close();
        this.props.onFilterChanged(data);
    },

    _onSelectCategory(id) {
        this.setState({
            selectedCategory: id
        });
    },

    _clearCategory(category) {
        category.items.forEach(item => { item.selected = false; });
    },

    _onSelectOption(category, option) {
        if (option.title === '不限' && option.selected === false) {
            this._clearCategory(category);
            option.selected = true;
            this.setState({
                data: this.state.data
            });
        } else {
            if (category.multi) {
                category.items[0].selected = false;
                option.selected = !option.selected;
                this.setState({
                    data: this.state.data
                });
            } else {
                if (option.selected) return; 

                this._clearCategory(category);
                option.selected = true;

                this.setState({
                    data: this.state.data
                });
            }
        }
    },

    renderHeader() {
        return (
            <View style={[styles.header]}>
                <View style={[styles.titleWrapper]}>
                    <Text style={[styles.titleText]}>选择筛选条件</Text>
                </View>
                <TouchableOpacity style={[styles.closeButton]} onPress={this._close}>
                    <Icon name='ios-close-empty' size={36} color='#e9573e' style={[styles.closeIcon]} />
                </TouchableOpacity>
            </View>
        );
    },

    renderFooter() {
        return (
            <View style={[styles.footer]} >
                <TouchableOpacity style={[styles.reset]}>
                    <Text style={[styles.footerText]}>恢复默认</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.submit]} onPress={this.closeFilterPicker}>
                    <Text style={[styles.footerText]}>确     定</Text>
                </TouchableOpacity>
            </View>
        );
    },

    renderCategories() {
        return (
            <ScrollView style={styles.itemWrapper}>
                { 
                    Filters.map(item => {
                        return (
                            <TouchableOpacity 
                                key={"cate_"+item.id} 
                                onPress={() => { this._onSelectCategory(item.id)}}>
                                <View style={[styles.item, styles.categoryItem, this.state.selectedCategory == item.id ? styles.categorySelected : null]}>
                                    <Text style={[styles.itemText]}>{item.title}</Text>
                                </View>
                            </TouchableOpacity>
                        ) 
                    })
                }
            </ScrollView>
        );
    },

    renderOptions() {
        var category = Filters.find(item => item.id === this.state.selectedCategory ? item: false );

        return (
            <ScrollView horizontal={false} style={styles.itemWrapper}>
                { 
                    category.items.map((item, index) => {
                        return (
                            <TouchableOpacity 
                                key={'option_'+category.id+'_'+index} 
                                onPress={() => { this._onSelectOption(category, item) }} >
                                <View style={[styles.item, styles.optionItem]}>
                                    <View style={ styles.itemTextWraper }>
                                        <Text style={[styles.itemText, item.selected ? styles.optionSelected : null]}>{item.title}</Text>
                                    </View>
                                    <Icon name='ios-checkmark' size={20} color='#e9573e' style={[styles.checkIcon, item.selected ? styles.optionSelected : null]} />
                                </View>
                            </TouchableOpacity>
                        );
                    })
                }
            </ScrollView>
        );
    },

    renderBody() {
        return (
            <View style={[styles.body]}>
                <View style={styles.categoryWraper}>
                    { this.renderCategories() }
                </View>
                <View style={styles.optionWrapper}>
                    { this.renderOptions() }
                </View>
            </View>
        );
    },

    render() {
        var categoryWidth = Math.floor(33*width/100);
        return (
            <Modal style={[styles.container]} backdrop={false} swipeToClose={false} position={"bottom"} ref={"picker"}>
                { this.renderHeader() }
                { this.renderBody() }
                { this.renderFooter() }
            </Modal>
        );
    }
});

module.exports = HotelFilterPicker;

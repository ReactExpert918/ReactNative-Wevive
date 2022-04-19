import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput
} from 'react-native';

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";
import  Icon  from './Icon';
import form_styles from '../styles/forms';
import {colors} from '../../app.json';
import { TouchableOpacity} from 'react-native-gesture-handler'

export default class extends Component {
  state = {
    keyword: "",
    filterShown: false,
    filter: "",
    orderDesc: true,
    styles: {...form_styles(), ...StyleSheet.create({
      container: {
        marginTop: responsiveWidth(2),
        backgroundColor: 'transparent',
        flexDirection: "row",
        position: "relative",
        zIndex: 100,
      },
      searchIcon: {
        alignSelf: "center",
        textAlign: "center",
        justifyContent: "center",
        marginLeft: responsiveHeight(2.5),
      },
      filterIcon: {
        
      },
      filterIconContainerStyle: {
        alignSelf: "center",
        right: -responsiveWidth(2.5),
        top: responsiveWidth(5)
      },
      filterContainerStyles: {
        position: "absolute",
        backgroundColor: colors.sidebarBackground,
        right: -responsiveWidth(4.5)-2,
        top: -responsiveWidth(2),
        paddingBottom: responsiveWidth(10),
        borderTopLeftRadius: responsiveWidth(4),
        borderBottomLeftRadius: responsiveWidth(4),
      },
      filterTextContainer: {
        borderBottomColor: colors.textMain,
        borderBottomWidth: 1,
        marginHorizontal: responsiveWidth(3.5),
        paddingVertical: responsiveWidth(3),
        flexDirection: "row",
        
      },  
      filterText: {
        color: colors.sidebarText,
        fontSize: responsiveFontSize(2.5),
        fontWeight: "200",
      },
      selectedFilterText: {
        color: colors.secondary,
        fontSize: responsiveFontSize(2.5),
        fontWeight: "200",
      },
      filterTextIcon: {
        alignSelf: "center",
        marginRight: responsiveWidth(3),
      },
      orderIcon: {
        alignSelf: "center",
        marginLeft: responsiveWidth(3),
        transform: [{ rotate: '180deg'}],
      },
      orderIconDesc: {
        alignSelf: "center",
        marginLeft: responsiveWidth(3),
      }
    })}
  };
  componentDidMount() {
    global.toggleContentScroll = () => {
      this.setState({scrollEnabled: !this.state.scrollEnabled});
    };
  }
  handleChange(value) {
    this.setState({keyword:value});
    this.props.onValueChanged(value);
  }
  setFieldBlur() {
  }
  setFieldFocus() {
  }
  toggleFilters() {
    this.setState({filterShown:!this.state.filterShown});
  }
  handleFilterChange(filter) {
    if (filter != this.state.filter) {
      this.setState({filter,orderDesc:true},() => {
        this.props.onFilterChanged(filter, this.state.orderDesc);
      });
    } else {
      this.setState({orderDesc:!this.state.orderDesc},()=> {
        this.props.onFilterChanged(filter, this.state.orderDesc);
      });
    }
    this.toggleFilters();
  }
  orderToggler(type) {
    return this.state.filter == type ?
      <Icon name="arrowdown"
            size={13} 
            color={this.state.filter == type ? this.state.styles.selectedFilterText.color : this.state.styles.filterText.color} 
            style={this.state.orderDesc ? this.state.styles.orderIconDesc : this.state.styles.orderIcon}
            />
    : null;
  }
  render() {
    return (
        <View style={this.state.styles.container}>
          <View style={this.state.styles.searchContainerStyle}>
            <Icon name="search" size={25} style={this.state.styles.searchIcon} color={this.state.styles.searchInputStyle.color}/>
            <TextInput
              value={this.state.keyword}
              onChangeText={this.handleChange.bind(this)}
              onBlur={this.setFieldBlur}
              onFocus={this.setFieldFocus}
              placeholder={"Search"}
              name="search"
              style={this.state.styles.searchInputStyle}
              placeholderTextColor={this.state.styles.searchInputStyle.color}
              autoCapitalize="none"
              testID="search"
              accessibilityLabel="search"
              accessible
            />
          </View>
          <TouchableOpacity style={this.state.styles.filterIconContainerStyle} onPress={this.toggleFilters.bind(this)}>
              <Icon name="menuround" size={38} style={this.state.styles.filterIcon} color={"white"}/>
          </TouchableOpacity>
          {this.state.filterShown ?
            <View style={this.state.styles.filterContainerStyles}>
              <TouchableOpacity style={this.state.styles.filterTextContainer} onPress={this.toggleFilters.bind(this)}>
                <Icon name="closeicon" size={18} color={colors.headerText} style={this.state.styles.filterTextIcon}/>
              </TouchableOpacity>
              <TouchableOpacity style={this.state.styles.filterTextContainer} onPress={() => this.handleFilterChange('')}>
                <Icon name="menu" size={18} color={this.state.filter == '' ? this.state.styles.selectedFilterText.color : this.state.styles.filterText.color} style={this.state.styles.filterTextIcon}/>
                <Text style={this.state.filter == '' ? this.state.styles.selectedFilterText : this.state.styles.filterText}>ALL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={this.state.styles.filterTextContainer} onPress={() => this.handleFilterChange('popular')}>
                <Icon name="menu" size={18} color={this.state.filter == 'popular' ? this.state.styles.selectedFilterText.color : this.state.styles.filterText.color} style={this.state.styles.filterTextIcon}/>
                <Text style={this.state.filter == 'popular' ? this.state.styles.selectedFilterText : this.state.styles.filterText}>POPULAR</Text>
                {this.orderToggler("popular")}
              </TouchableOpacity>
              <TouchableOpacity style={this.state.styles.filterTextContainer} onPress={() => this.handleFilterChange('new')}>
                <Icon name="menu" size={18} color={this.state.filter == 'new' ? this.state.styles.selectedFilterText.color : this.state.styles.filterText.color} style={this.state.styles.filterTextIcon}/>
                <Text style={this.state.filter == 'new' ? this.state.styles.selectedFilterText : this.state.styles.filterText}>NEWEST</Text>
                {this.orderToggler("new")}
              </TouchableOpacity>
              <TouchableOpacity style={this.state.styles.filterTextContainer} onPress={() => this.handleFilterChange('price')}>
              <Icon name="menu" size={18} color={this.state.filter == 'price' ? this.state.styles.selectedFilterText.color : this.state.styles.filterText.color} style={this.state.styles.filterTextIcon}/>
                <Text style={this.state.filter == 'price' ? this.state.styles.selectedFilterText : this.state.styles.filterText}>PRICE</Text>
                {this.orderToggler("price")}
              </TouchableOpacity>
              <TouchableOpacity style={this.state.styles.filterTextContainer} onPress={() => this.handleFilterChange('prize')}>
              <Icon name="menu" size={18} color={this.state.filter == 'prize' ? this.state.styles.selectedFilterText.color : this.state.styles.filterText.color} style={this.state.styles.filterTextIcon}/>
                <Text style={this.state.filter == 'prize' ? this.state.styles.selectedFilterText : this.state.styles.filterText}>CASH PRIZES</Text>
                {this.orderToggler("prize")}
              </TouchableOpacity>
            </View>
          : null}
        </View>
    );
  }
}
import React, { Component} from 'react';
import {StyleSheet, View, Text,TouchableOpacity} from 'react-native';
import { DrawerItems} from 'react-navigation-drawer'

import firebase from 'firebase';

export default class CustomSideBarMenu extends Component {
    constructor(){
        super();
    }
    render(){
        return(
            <View>
               <View>
                   <DrawerItems { ...this.props}/>
               </View>
               <View>
                   <TouchableOpacity onPress={()=>{
                       this.props.navigation.navigate('SignUpLoginScreen')
                       firebase.auth().signOut()
                   }}>
                       <Text> Logout</Text>
                   </TouchableOpacity>
               </View>
            </View>

        );
    }
}

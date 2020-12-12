import React ,{Component} from 'react'
import {View, Text,TouchableOpacity,FlatList,StyleSheet} from 'react-native';
import {Card,Icon,ListItem} from 'react-native-elements'
import MyHeader from '../components/MyHeader.js'
import firebase from 'firebase';
import db from '../config.js'

export default class MyBartersScreen extends Component {
  static navigationOptions = { header: null };

   constructor(){
     super()
     this.state = {
       exchangerId : firebase.auth().currentUser.email,
       exchangerName : "",
       allBarters : []
     }
     this.requestRef= null
   }

   getExchangerDetails=(exchangerId)=>{
    db.collection("users").where("email_id","==", exchangerId).get()
    .then((snapshot)=>{
      snapshot.forEach((doc) => {
        this.setState({
          "exchangerName" : doc.data().first_name + " " + doc.data().last_name
        })
      });
    })
  }

   getAllBarters =()=>{
     this.requestRef = db.collection("all_barters").where("exchanger_id" ,'==', this.state.exchangerId)
     .onSnapshot((snapshot)=>{
       var allBarters = snapshot.docs.map(document => document.data());
       this.setState({
         allBarters : allBarters,
       });
     })
   }

   sendItem=(ItemDetails)=>{
    if(ItemDetails.request_status === "Item exchanged"){
      var requestStatus = "Exchanger  Interested"
      db.collection("all_barters").doc(ItemDetails.doc_id).update({
        "request_status" : "Exchanger Interested"
      })
      this.sendNotification(ItemDetails,requestStatus)
    }
    else{
      var requestStatus = "Item Exchanged"
      db.collection("all_barters").doc(ItemDetails.doc_id).update({
        "request_status" : "Item Exchanged"
      })
      this.sendNotification(ItemDetails,requestStatus)
    }
  }

  sendNotification=(ItemDetails,requestStatus)=>{
    var requestId = ItemDetails.request_id
    var exchangerId = ItemDetails.exchanger_id
    db.collection("all_notifications")
    .where("request_id","==", requestId)
    .where("exchanger_id","==",exchangerId)
    .get()
    .then((snapshot)=>{
      snapshot.forEach((doc) => {
        var message = ""
        if(requestStatus === "item"){
          message = this.state.exchangerName + " has exchanged item"
        }else{
           message =  this.state.exchangerName  + " has shown interest in exchanging the item"
        }
        db.collection("all_notifications").doc(doc.id).update({
          "message": message,
          "notification_status" : "unread",
          "date"                : firebase.firestore.FieldValue.serverTimestamp()
        })
      });
    })
  }

   keyExtractor = (item, index) => index.toString()

   renderItem = ( {item, i} ) =>(
     <ListItem
       key={i}
       title={item.item_name}
       subtitle={"Exchanged By : " + item.exchanged_by +"\nStatus : " + item.request_status}
       leftElement={<Icon name="item" type="font-awesome" color ='#696969'/>}
       titleStyle={{ color: 'black', fontWeight: 'bold' }}
       rightElement={
        <TouchableOpacity
         style={[
           styles.button,
           {
             backgroundColor : item.request_status === "Item Exchanged" ? "green" : "#ff5722"
           }
         ]}
         onPress = {()=>{
           this.sendItem(item)
         }}
        >
          <Text style={{color:'#ffff'}}>{
            item.request_status === "Item Exchanged" ? "Item Exchanged" : " Exchange Item"
          }</Text>
        </TouchableOpacity>
      }
    bottomDivider
  />
)




   componentDidMount(){
     this.getAllBarters()
     this.getExchangerDetails(this.state.exchangerId)

   }

   componentWillUnmount(){
     this.requestRef();
   }

   render(){
     return(
       <View style={{flex:1}}>
         <MyHeader navigation={this.props.navigation} title="My Barters"/>
         <View style={{flex:1}}>
           {
             this.state.allBarters.length === 0
             ?(
               <View style={styles.subtitle}>
                 <Text style={{ fontSize: 20}}>List of all items Exchangd</Text>
               </View>
             )
             :(
               <FlatList
                 keyExtractor={this.keyExtractor}
                 data={this.state.allBarters}
                 renderItem={this.renderItem}
               />
             )
           }
         </View>
       </View>
     )
   }
   }


const styles = StyleSheet.create({
  button:{
    width:100,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     },
    elevation : 16
  },
  subtitle :{
    flex:1,
    fontSize: 20,
    justifyContent:'center',
    alignItems:'center'
  }
})

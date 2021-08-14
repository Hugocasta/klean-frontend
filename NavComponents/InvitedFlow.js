import React from 'react';
import { connect } from 'react-redux'

import { createStackNavigator } from '@react-navigation/stack';

import InvitedMapScreen from '../PageComponents/InvitedMapScreen'
import InvitedEventDetail from '../PageComponents/InvitedEventDetail';
import Login from '../PageComponents/Login';
import SignUp from '../PageComponents/SignUp'
import OnBoarding from '../PageComponents/OnBoarding';
//import AdminPanel from '../PageComponents/AdminPanel';


const Stack = createStackNavigator();

function InvitedFlow(props) {
    return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/*Affichage conditionnel de l'onboarding : uniquement lors de la première visite*/}
        {props.tokenObj.IsFirstVisit && <Stack.Screen name="OnBoarding" component={OnBoarding} />}
        <Stack.Screen name="InvitedMapScreen" component={InvitedMapScreen} />
        <Stack.Screen name="InvitedEventDetail" component={InvitedEventDetail} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  )
}

function mapStateToProps(state) {
    return { tokenObj: state.tokenObj }
  }
  
  export default connect(
    mapStateToProps,
    null
  )(InvitedFlow);
import React, { useEffect } from 'react';
import { connect } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native';

import InvitedFlow from './InvitedFlow';
import ConnectedFlow from './ConnectedFlow';
import AsyncStorage from '@react-native-async-storage/async-storage';

import PROXY from "../proxy";

function Nav(props) {

  useEffect(() => {

    /* Fonction qui permet de récupérer les IDs des cleanwalks de l'utilisateur (qu'il organise/auxquelles il participe) 
    pour dynamiser la page détail des cleanwalks (EventDetail) */
    const loadCws = async (token) => {
      let rawResponse = await fetch(`${PROXY}/load-cw-forstore/${token}`);
      let response = await rawResponse.json();
      props.loadCwsStore({ infosCWparticipate: response.infosCWparticipate, infosCWorganize: response.infosCWorganize });
    }

    //Suppression du token lors de reset de la base de données (développement)
    //AsyncStorage.removeItem("token");

    //Récupération du token enregistré en local storage
    AsyncStorage.getItem('token', (err, value) => {
      if (value) {
        const valueParse = JSON.parse(value);
        props.login(valueParse.token);

        loadCws(valueParse.token);

      }
    });
    
  }, []);
  
  return (
    <NavigationContainer>
      {/*Affiche la stack invité s'il s'agit du token invité (par défaut), sinon affiche la stack des utilisateurs connecté*/}
      {props.tokenObj.token === "XeDLDMr3U4HSJSl74HJpKD" ? <InvitedFlow /> : <ConnectedFlow /> }
    </NavigationContainer>
  )
}


function mapStateToProps(state) {
  return { tokenObj: state.tokenObj }
}

function mapDispatchToProps(dispatch) {
  return {
    login: function (token) {
      dispatch({ type: "login", token });
    },
    loadCwsStore: function (cwsStore) {
      dispatch({ type: "loadCwsStore", cwsStore });
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Nav);
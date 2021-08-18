import React, { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  TextInput,
  KeyboardAvoidingView
} from "react-native";
import { connect } from "react-redux";
import { colors } from "./colors";
import { windowDimensions } from "./windowDimensions";
import PROXY from "../proxy";

/* Composant qui permet d'afficher une modal dont le rôle est de permettre à l'utilisateur 
de modifier son mot de passe dans la page profil */

const changePassword = (props) => {
  const [oldPass, setOldPass] = useState();
  const [newPass, setNewPass] = useState();
  const [confirmNewPass, setConfirmNewPass] = useState();
  const [errorPassword, setErrorPassword] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  function close() {
    props.close();
    setOldPass("");
    setNewPass("");
    setConfirmNewPass("");
  }

  async function updatePass() {
    let data = await fetch(PROXY + "/users/update-password", {
      method: "PUT",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `token=${props.tokenObj.token}&old=${oldPass}&new=${newPass}&confirmNewPass=${confirmNewPass}`,
    });
    let response = await data.json();

    if (response.result == true) {
      close();
    } else if (response.result == false) {
      setErrorPassword(response.error);
    }
  }
  //Tableau d'erreur permettant l'affichage de ces dernières
  let errorChangePassword = errorPassword.map((error, i) => {
    return <Text key={`error${i}`}>{error}</Text>;
  });


  return (
    <View style={styles.centeredView}>
      
      <Modal
        // la modal arrive par le bas de page avec un slide
        animationType="slide"
        // la modal prend toute la page et se pose sur un fond transparent
        transparent={true}
        visible={props.visible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <View style={styles.modalView}>
            <View>
              <TextInput
                name="oldPass"
                placeholder="Ancien mot de passe"
                placeholderTextColor="#95a5a6"
                style={styles.textInput}
                onChangeText={(value) => setOldPass(value)}
                value={oldPass}
                secureTextEntry={true}
              />
              <TextInput
                name="newPass"
                placeholder="Nouveau mot de passe"
                placeholderTextColor="#95a5a6"
                style={styles.textInput}
                onChangeText={(value) => setNewPass(value)}
                value={newPass}
                secureTextEntry={true}
              />
              <TextInput
                name="newPass"
                placeholder="Confirmer nouveau mot de passe"
                placeholderTextColor="#95a5a6"
                style={styles.textInput}
                onChangeText={(value) => setConfirmNewPass(value)}
                value={confirmNewPass}
                secureTextEntry={true}
              />
            </View>
            <View>{errorChangePassword}</View>

            <View>
              <Pressable
                style={[styles.button, styles.save]}
                onPress={() => updatePass()}
              >
                <Text style={styles.textStyle}>Sauvegarder</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => close()}
              >
                <Text style={styles.textStyle}>Annuler</Text>
              </Pressable>
            </View>
          </View>
          </KeyboardAvoidingView>
        </View>
        
      </Modal>
    </View>
  );
};

function mapStateToProps(state) {
  return {
    tokenObj: state.tokenObj,
  };
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  save: {
    backgroundColor: colors.secondary,
    marginBottom: 10,
  },
  buttonClose: {
    backgroundColor: colors.primary,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  textInput: {
    height: 40,
    width: windowDimensions.width * 0.8,
    borderRadius: 3,
    backgroundColor: colors.grey,
    paddingLeft: 10,
    justifyContent: "center",
    marginTop: 13,
    marginBottom: 20,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default connect(mapStateToProps, null)(changePassword);

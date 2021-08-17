import React from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { colors } from "./colors";
import { typography } from "./typography";
import { windowDimensions } from "./windowDimensions";

/* Composant qui permet l'affichage de l'ensemble des inputs de l'application */

function InputElement(props) {
  if (props.type === "simpleInput") {
    return (
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          //Au changement de texte, modification de l'état associé à l'input via un setter passé en props et affichage du composant autocomplete lorsque cela est nécessaire
          onChangeText={(value) => {props.setState(props.name, value); props.setShowAutoComplete? props.setShowAutoComplete(true): null}}
          value={props.value}
          placeholder={props.placeholder}
          //Permet de sécuriser l'affichage du texte dans le cas d'un champ de saisi de mot de passe
          secureTextEntry={props.secureTextEntry}
        />
      </View>
    );
  } else if (props.type === "simpleInputDisabled") {
    return (
      <View style={styles.inputDisabledContainer}>
        <TextInput
          style={styles.input}
          onChangeText={(value) => {props.setState(props.name, value)}}
          value={props.value}
          placeholder={props.placeholder}
        />
      </View>
    );
  } else if (props.type === "multilineInput") {
    return (
      <View style={styles.multilineInputContainer}>
        <TextInput
          style={styles.inputMultiline}
          multiline
          numberOfLines={4}
          //Au changement de texte, modification de l'état associé à l'input via une fonction passé en props
          onChangeText={(value) => {props.setState(props.name, value)}}
          value={props.value}
          placeholder={props.placeholder}
        />
      </View>
    );
  } else if (props.type === "messageInput") {
    return (
      <View style={styles.messageInputContainer}>
        <TextInput
          style={styles.input}
          //Au changement de texte, modification de l'état associé à l'input via un setter d'état passé en props
          onChangeText={(value) => {props.onChangeText(value)}}
          value={props.value}
          placeholder={props.placeholder}
        />
      </View>
    );
  } else if (props.type === "modificationPasswwordInput") {
    return (
      <View style={styles.modificationInputContainer}>
        <TextInput
          style={styles.input}
          //Au changement de texte, modification de l'état associé à l'input via un setter d'état passé en props
          onChangeText={(value) => {props.onChangeText(value)}}
          value={props.value}
          placeholder={props.placeholder}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    fontFamily: typography.bodyLight.fontFamily,
    fontSize: typography.bodyLight.fontSize,
    paddingHorizontal: 5
  },
  inputMultiline: {
    fontFamily: typography.bodyLight.fontFamily,
    fontSize: typography.bodyLight.fontSize,
    textAlignVertical: "top",
    paddingVertical: 10,
    paddingHorizontal: 5
  },
  inputContainer: {
    height: 40,
    width: windowDimensions.width * 0.8,
    borderRadius: 3,
    backgroundColor: colors.grey,
    paddingLeft: 10,
    justifyContent: "center",
    marginTop: 13,
  },
  inputDisabledContainer: {
    height: 40,
    width: windowDimensions.width * 0.8,
    borderRadius: 3,
    backgroundColor: colors.greyOff,
    paddingLeft: 10,
    justifyContent: "center",
    marginTop: 13,
  },
  multilineInputContainer: {
    height: 115,
    width: windowDimensions.width * 0.8,
    borderRadius: 3,
    backgroundColor: colors.grey,
    paddingLeft: 10,
    alignItems: "flex-start",
    marginTop: 13,
  },
  messageInputContainer: {
    height: windowDimensions.height * 0.05,
    width: windowDimensions.width * 0.9,
    borderRadius: 3,
    borderColor: colors.grey,
    borderWidth: 1,
    paddingLeft: 10,
    justifyContent: "center",
  },
  modificationInputContainer: {
    height: 22,
    width: 250,
    borderRadius: 3,
    backgroundColor: colors.grey,
    paddingLeft: 10,
    justifyContent: "center",
  },
});

export default InputElement;

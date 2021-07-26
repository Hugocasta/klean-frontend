import React from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { colors } from "./colors";

function InputElement(props) {
  if (props.type === "simpleInput") {
    return (
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={props.onChangeText}
          value={props.value}
          placeholder={props.placeholder}
        />
      </View>
    );
  } else if (props.type === "simpleInputDisabled") {
    return (
      <View style={styles.inputDisabledContainer}>
        <TextInput
          style={styles.input}
          onChangeText={props.onChangeText}
          value={props.value}
          placeholder={props.placeholder}
        />
      </View>
    );
  } else if (props.type === "multilineInput") {
    return (
      <View style={styles.multilineInputContainer}>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={4}
          onChangeText={props.onChangeText}
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
          onChangeText={props.onChangeText}
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
          onChangeText={props.onChangeText}
          value={props.value}
          placeholder={props.placeholder}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    fontFamily: "Lato_300Light",
    fontSize: 12,
  },
  inputContainer: {
    height: 22,
    width: 300,
    borderRadius: 3,
    backgroundColor: colors.grey,
    paddingLeft: 10,
    justifyContent: "center",
    marginTop: 13,
  },
  inputDisabledContainer: {
    height: 22,
    width: 300,
    borderRadius: 3,
    backgroundColor: colors.greyOff,
    paddingLeft: 10,
    justifyContent: "center",
  },
  multilineInputContainer: {
    height: 115,
    width: 300,
    borderRadius: 3,
    backgroundColor: colors.grey,
    paddingLeft: 10,
    alignItems: "flex-start",
  },
  messageInputContainer: {
    height: 22,
    width: 300,
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
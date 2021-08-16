/* Permet l'export des font families et font size de l'application sous forme de variable*/

let mainSize = 14

export const typography = {

  h1: {
    fontSize: mainSize + 6,
    fontFamily: "Lato_900Black",
  },
  h2: {
    fontSize: mainSize + 4,
    fontFamily: "Lato_700Bold",
  },
  h3: {
    fontSize: mainSize + 2,
    fontFamily: "Lato_700Bold",
  },
  body: {
    fontSize: mainSize,
    fontFamily: "Lato_400Regular",
  },
  bodyLight: {
    fontSize: mainSize,
    fontFamily: "Lato_300Light",
  },
  bodyLightItalic: {
    fontSize: mainSize,
    fontFamily: "Lato_300Light_Italic",
  },
  buttonLight: {
    fontSize: mainSize,
    fontFamily: "Lato_300Light",
  },
  postClInformationText: {
    fontSize: mainSize + 2,
    fontFamily: "Lato_400Regular",
  },
  buttonFineTxt: {
    fontSize: mainSize + 6,
    fontFamily: "Lato_400Regular",
  },

};
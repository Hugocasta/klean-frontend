/* Permet l'export des dimensions de l'écran actuel sous forme de variable*/

import { Dimensions } from "react-native";

export const windowDimensions = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
}
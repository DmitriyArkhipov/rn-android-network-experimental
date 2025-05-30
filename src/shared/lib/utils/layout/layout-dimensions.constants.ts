import { Dimensions } from 'react-native';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');

export const Layout = {
    // window не учитывает на Android высоту status bar и bottom navigation bar
    window: {
        width: windowWidth,
        height: windowHeight,
    },
    screen: {
        width: screenWidth,
        height: screenHeight,
    },
};

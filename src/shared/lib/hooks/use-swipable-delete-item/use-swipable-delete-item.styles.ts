import { StyleSheet } from 'react-native';

import { Colors } from '../../../ui/design-system';

export const swipableStyles = StyleSheet.create({
    container: {
        backgroundColor: Colors.error,
        overflow: 'visible',
    },
    containerItem: {
        backgroundColor: Colors.error,
        height: '100%',
        paddingHorizontal: 12,
        justifyContent: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center',
    },
});

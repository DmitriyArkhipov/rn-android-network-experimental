import { DevSettings } from 'react-native';

import { navigate } from '@/navigation/navigation-methods.util';
import { Screens } from '@/navigation/screens.constants';

export const addAditionalDebugDevItems = () => {
    if (!__DEV__) {
        return;
    }
    DevSettings.addMenuItem('Показать экран отладки', () => {
        navigate(Screens.DEV_INFO);
    });
};

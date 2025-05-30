import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

export const useKeyboardListener = () => {
    const [isKeyboardDidVisible, setKeyboardDidVisible] = useState(false);
    const [isKeyboardWillVisible, setKeyboardWillVisible] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardDidVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setTimeout(() => setKeyboardDidVisible(false), 50);
        });
        const keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', () => {
            setKeyboardWillVisible(true);
        });
        const keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', () => {
            setKeyboardWillVisible(false);
        });

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
            keyboardWillShowListener.remove();
            keyboardWillHideListener.remove();
        };
    }, []);

    return { isKeyboardDidVisible, isKeyboardWillVisible };
};

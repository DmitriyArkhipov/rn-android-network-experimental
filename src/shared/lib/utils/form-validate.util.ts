import { isEmpty, isObject, isString } from '@/shared/lib/services/lodash.util';

import { RegExpConstants } from '../constants/regex.constants';

export const validateRequiredInput = (input: Maybe<string | Object>): Maybe<string> => {
    if (!input || (isString(input) && !input.trim()) || (isObject(input) && isEmpty(input))) {
        return 'обязательное поле';
    }

    return undefined;
};

export const validateLetterOrNumberContaining = (input: Maybe<string>): Maybe<string> => {
    if (!RegExpConstants.letterOrNumberRequired.test(input || '')) {
        return 'название сообщества должно содержать хотя бы одну букву или цифру';
    }

    return undefined;
};

export const validateNameInput = (input: string): string | undefined => {
    if (!input || !input.trim()) {
        return 'обязательное поле';
    }

    if (input.length < 2) {
        return 'напишите минимум две буквы';
    }

    if (!RegExpConstants.lettersAndDashOnly.test(input)) {
        return 'только буквы и дефис';
    }

    return undefined;
};

export const validateValueAsNumber = (input: string): Maybe<string> => {
    if (!Number(input)) {
        return 'вводите только цифры';
    }

    return undefined;
};

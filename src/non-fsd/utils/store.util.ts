import getStore from '@/app/model';

import { sleep } from '@/shared/lib/utils/timeout.util';

// Данная утилита содержит ретрай getState, это нужно для кейсов в которых store не успевает инициализироваться при старте приложения
export const getStateAsync = async (ms = 250) => {
    let state = getStore()?.getState();

    if (!state) {
        await sleep(ms);
        state = getStore()?.getState();
    }

    return state;
};

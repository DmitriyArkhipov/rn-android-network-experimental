// import apiClientService from "@/shared/api/api-client/api-client.service";
// import { postSmsChallenge } from "@/shared/api/data/authorization.data";
import axios from "axios";
import { useCallback } from "react";
import { Alert } from "react-native";

export const useRequest = () => {
    const handleRequest = useCallback(async () => {
        const startTime = Date.now();
        
        console.log('handleRequest');

        try {
            // const response = await postSmsChallenge(
            //     '79999999999'
            // )

            // console.log(axios.defaults.headers);

            axios.defaults.headers.common['User-Agent'] = 'setka/1.0.0 Android';

            // const response = await axios.get('https://api.setka.ru/v1/suggest/country?text=', { timeout: 10000 });


            const responseIP = await axios.get('https://ipv4.icanhazip.com/');
            console.log(responseIP.data);

            const controller = new AbortController();
            const signal = controller.signal;
            
            const timeoutId = setTimeout(() => {
                const timeElapsed = Date.now() - startTime;
                console.log(`Request timeout after ${timeElapsed}ms`);
                controller.abort();
            }, 100000);

            console.log('Starting request...');
            const response = await axios.get(`https://api.setka.ru/v1/suggest/country?text=${Date.now()}`, {
                signal
            });
            const endTime = Date.now();
            console.log(`Request completed in ${endTime - startTime}ms`);

            Alert.alert(JSON.stringify(response));

            clearTimeout(timeoutId);
        } catch (error: unknown) {
            if (axios.isCancel(error)) {
                const timeElapsed = Date.now() - startTime;
                console.log(`Request cancelled after ${timeElapsed}ms`);
                console.log('Cancel reason:', (error as Error).message);
                if ((error as any).code) {
                    console.log('Error code:', (error as any).code);
                }
            } else {
                console.log(`Request failed after ${Date.now() - startTime}ms`);
                console.log('Error details:', {
                    message: (error as Error).message,
                    code: (error as any).code,
                    response: (error as any).response?.data,
                    status: (error as any).response?.status
                });
                Alert.alert(JSON.stringify(error));
            }
        }
    }, []);

    return {
        onRequest: handleRequest
    };
};

import apiClientService from "@/shared/api/api-client/api-client.service";
import { postSmsChallenge } from "@/shared/api/data/authorization.data";
import axios from "axios";
import { useCallback } from "react";
import { Alert } from "react-native";

export const useRequest = () => {
    const handleRequest = useCallback(async () => {
        console.log('handleRequest');

        try {
            // const response = await postSmsChallenge(
            //     '79999999999'
            // )

            // const response = await axios.get('https://api.setka.ru/v1/suggest/country?text=');
            // const response = await axios.get('https://ya.ru');
            const response = await axios.get('https://www.cloudflare.com');

            Alert.alert(JSON.stringify(response));
        } catch (error) {
            Alert.alert(JSON.stringify(error));
        }
    }, []);

    return {
        onRequest: handleRequest
    };
};

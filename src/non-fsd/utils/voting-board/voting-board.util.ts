// @ts-expect-error - auto-ts-ignore
import hex from 'crypto-js/enc-hex';
// @ts-expect-error - auto-ts-ignore
import hmac from 'crypto-js/hmac-sha256';

import { type AccountResponse } from '@/shared/api/types/api.types';
import { RegExpConstants } from '@/shared/lib/constants/regex.constants';

import {
    APP_ID,
    BASE_URL,
    BOARD_ID,
    EMAIL_DOMAIN,
    SECRET_KEY,
    WIDGET_PATH,
} from '@/non-fsd/utils/voting-board/voting-board.constants';

export const isVotingBoardLink = (url: string) => !!url.match(RegExpConstants.votingBoardLink)?.length;

export const getVotingBoardHtml = (url: string, account: Maybe<AccountResponse>) => {
    if (!account) {
        return { uri: url };
    }

    const name = `${account.last_name} ${account.first_name}`;
    const email = `${account.uuid}${EMAIL_DOMAIN}`;
    const hash = hmac(email, SECRET_KEY).toString(hex);

    const html = `
        <head>
            <title>Setka ideas</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
        </head>
        <body style="margin: 0; padding: 0">
            <div id="board"></div>
            <script>
                !function(b,c,f,d,a,e){b.dclsPxl||(((d=b.dclsPxl=function(){d.callMethod?d.callMethod.apply(d,arguments):d.queue.push(arguments)}).push=d).queue=[],(a=c.createElement("script")).async=!0,a.src=f,(e=c.getElementsByTagName("script")[0]).parentNode.insertBefore(a,e))}
                (window,document,"${WIDGET_PATH}");
                dclsPxl("initWidget", { appId: "${APP_ID}", boardId: "${BOARD_ID}", user: { email: "${email}", hash: "${hash}", name: "${name}" }, embedBoard:{ selector: "#board" }});
            </script>
        </body>
    `;

    return { html, baseUrl: BASE_URL };
};

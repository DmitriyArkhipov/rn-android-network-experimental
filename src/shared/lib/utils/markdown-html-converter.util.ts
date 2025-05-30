// @ts-expect-error - auto-ts-ignore

import showdown from 'showdown';
// @ts-expect-error - auto-ts-ignore
import TurndownService from 'turndown-rn';

// Памятка по форматам:
// ++ underline
// ~~ strikethrough
// * italics
// ** bold

export const convertMarkdownToHTML = (text: string) => {
    if (!text) {
        return '';
    }
    const converter = new showdown.Converter();
    converter.setOption('strikethrough', true);
    converter.setOption('underline', true);

    const html = converter.makeHtml(text.replaceAll('\n', '<br>'));

    return html;
};

export const convertHTMLToMarkdown = (html: string) => {
    const turndownService = new TurndownService();
    const markdown = turndownService.turndown(html.replaceAll('<p></p>', '<br>'));

    return markdown;
};

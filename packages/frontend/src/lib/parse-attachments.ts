export type ParsedAttachments = {
    firstAttachment?: string;
    fragments: {
        content: string;
        attachment: string;
    }[];
    lastFragment?: string;
    images: string[];
};

const parseEscapedAttachment = (content: string) => {
    const attachment = /(=*)=(?={{attachment::\S+?}})/g;
    return content.replace(attachment, (_, g1) => g1);
};

export const parseAttachments = (content: string) => {
    const result: ParsedAttachments = { fragments: [], images: [] };

    const imgParseRe = /(?<!=+)!\[.*?\]\((\S+?)\)/g;
    let imgParseMatch: RegExpExecArray | null = null;
    while ((imgParseMatch = imgParseRe.exec(content)) != null) {
        result.images.push(imgParseMatch[1]);
    }

    const firstAttachmentRe = /^\s*{{attachment::(\S+?)}}(.+)$/s;
    const hasFirstAttachment = firstAttachmentRe.exec(content);
    if (hasFirstAttachment) {
        result.firstAttachment = hasFirstAttachment[1];
        content = hasFirstAttachment[2];
    }

    const parseRe = /(.+?)(?:(?<!=+){{attachment::(\S+?)}}|$)/gs;

    let parseMatch: RegExpExecArray | null = null;
    while ((parseMatch = parseRe.exec(content)) != null) {
        if (!parseMatch[2]) {
            if (!/^\s*$/s.test(parseMatch[1])) {
                result.lastFragment = parseEscapedAttachment(parseMatch[1]);
            }
            return result;
        }
        result.fragments.push({ content: parseEscapedAttachment(parseMatch[1]), attachment: parseMatch[2] });
    }
    return result;
};

const rebuildEscapedAttachment = (content: string) => {
    const escapeRe = /=*{{attachment:\S*}}/g;
    return content.replace(escapeRe, (s) => `=${s}`);
};

export const rebuildMarkdown = (parsed: ParsedAttachments) => {
    let output = '';
    if (parsed.firstAttachment) {
        output += `{{attachment::${parsed.firstAttachment}}}`;
    }
    for (const fragment of parsed.fragments) {
        output += rebuildEscapedAttachment(fragment.content);
        output += `{{attachment::${fragment.attachment}}}`;
    }
    if (parsed.lastFragment) {
        output += rebuildEscapedAttachment(parsed.lastFragment);
    }
    return output;
};

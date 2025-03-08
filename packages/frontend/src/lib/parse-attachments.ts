export type ParsedAttachments = {
    firstAttachment?: string;
    fragments: {
        content: string;
        attachment: string;
    }[];
    lastFragment?: string;
    images: string[];
};

export const parseAttachments = (content: string) => {
    const result: ParsedAttachments = { fragments: [], images: [] };

    const imgParseRe = /!\[.+?\]\((\S+?)\)/g;
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

    const parseRe = /^(.+?)(?:{{attachment::(\S+?)}}|$)/gs;

    let parseMatch: RegExpExecArray | null = null;
    while ((parseMatch = parseRe.exec(content)) != null) {
        if (!parseMatch[2]) {
            if (!/^\s*$/s.test(parseMatch[1])) {
                result.lastFragment = parseMatch[1];
            }
            return result;
        }
        result.fragments.push({ content: parseMatch[1], attachment: parseMatch[2] });
    }
    return result;
};

export const rebuildMarkdown = (parsed: ParsedAttachments) => {
    let output = '';
    if (parsed.firstAttachment) {
        output += `{{attachment::${parsed.firstAttachment}}}`;
    }
    for (const fragment of parsed.fragments) {
        output += fragment.content;
        output += `{{attachment::${fragment.attachment}}}`;
    }
    if (parsed.lastFragment) {
        output += parsed.lastFragment;
    }
    return output;
};

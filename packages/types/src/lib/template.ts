export const template = (templateStrings: TemplateStringsArray, ...params: any[]) => {
    let output = '';
    for (let i = 0; i < params.length; i++) {
        output += templateStrings[i];
        output += params[i].toString();
    }
    output += templateStrings[params.length];
    const lines = output.split('\n');
    const firstLine = lines[1];
    const match = /^(\s*)/.exec(firstLine)!;
    const spaceLen = match[1].length;
    const newLines = lines
        .filter((_, i) => i >= 1)
        .map((s) => {
            if (s.length < spaceLen) {
                return s;
            }
            return s.substring(spaceLen);
        });

    return (indents: number) => newLines.map((s) => ''.padStart(indents, ' ') + s).join('\n');
};

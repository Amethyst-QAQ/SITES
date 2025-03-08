import { upload } from '@/request';
import { parseAttachments, type ParsedAttachments } from './parse-attachments';
import { useSessionStore } from '@/stores/session';
import { UploadFileFail } from 'types/lib/upload-file-fail';

const collectMdFiles = async (dirHandle: FileSystemDirectoryHandle, logs: string[]) => {
    const mdFiles: Array<{ fileHandle: FileSystemFileHandle; dirHandle: FileSystemDirectoryHandle }> = [];
    const traverse = async (currentDirHandle: FileSystemDirectoryHandle) => {
        for await (const entry of (currentDirHandle as any).values() as FileSystemHandle[]) {
            if (entry.kind === 'file' && entry.name.endsWith('.md')) {
                logs.push(`发现${entry.name}`);
                mdFiles.push({ fileHandle: entry as FileSystemFileHandle, dirHandle: currentDirHandle });
            } else if (entry.kind === 'directory') {
                await traverse(entry as FileSystemDirectoryHandle);
            }
        }
    };
    await traverse(dirHandle);
    return mdFiles;
};

const resolveAttachmentFile = async (relativePath: string, dirHandle: FileSystemDirectoryHandle) => {
    try {
        const parts = relativePath.split(/[\\/]/);
        let currentDirHandle = dirHandle;
        for (let i = 0; i < parts.length - 1; i++) {
            currentDirHandle = await currentDirHandle.getDirectoryHandle(parts[i]);
        }
        const fileHandle = await currentDirHandle.getFileHandle(parts[parts.length - 1]);
        return await fileHandle.getFile();
    } catch (error) {
        return null;
    }
};

export class ListFileError extends Error {
    constructor(public reason: any) {
        super('获取文件列表失败');
    }
}

export const uploadFolder = async (folder: FileSystemDirectoryHandle, logs: string[]) => {
    const session = useSessionStore();
    const attachments: { firstAttachment?: File; attachments: File[]; images: File[] }[] = [];
    const markdownList: {
        name: string;
        parsed: ParsedAttachments;
        uploadSuccess: boolean;
    }[] = [];

    try {
        const mdFiles = await collectMdFiles(folder, logs);

        for (const mdFile of mdFiles) {
            const file = await mdFile.fileHandle.getFile();
            const content = await file.text();
            const parsed = parseAttachments(content);

            const attachmentPaths = [
                ...(parsed.firstAttachment ? [parsed.firstAttachment] : []),
                ...parsed.fragments.map((f) => f.attachment).filter(Boolean),
            ];

            const attachmentFiles: File[] = [];
            const imageFiles: File[] = [];
            let allAttachmentsExist = true;

            for (const path of attachmentPaths) {
                const file = await resolveAttachmentFile(path, mdFile.dirHandle);
                if (!file) {
                    allAttachmentsExist = false;
                    break;
                }
                attachmentFiles.push(file);
            }

            for (const path of parsed.images) {
                const file = await resolveAttachmentFile(path, mdFile.dirHandle);
                if (!file) {
                    allAttachmentsExist = false;
                    break;
                }
                imageFiles.push(file);
            }

            if (!allAttachmentsExist) {
                logs.push(`${mdFile.fileHandle.name}的附件不完整，放弃上传此文件`);
                continue;
            }

            const firstFile = parsed.firstAttachment ? attachmentFiles.shift()! : undefined;
            attachments.push({
                firstAttachment: firstFile,
                attachments: attachmentFiles,
                images: imageFiles,
            });

            markdownList.push({
                name: file.name.replace(/\.md$/, ''),
                parsed: parsed,
                uploadSuccess: true,
            });
        }
    } catch (e) {
        throw new ListFileError(e);
    }

    logs.push('开始上传附件');

    await Promise.all(
        attachments.map((obj, i) => {
            const editFirstAttachment = (success: boolean, newName?: string) => {
                markdownList[i].uploadSuccess = success;
                markdownList[i].parsed.firstAttachment = newName ?? '';
            };
            const editAttachment = (index: number) => (success: boolean, newName?: string) => {
                markdownList[i].uploadSuccess = success;
                markdownList[i].parsed.fragments[index].attachment = newName ?? '';
            };
            const editImage = (index: number) => (success: boolean, newName?: string) => {
                markdownList[i].uploadSuccess = success;
                for (const fragment of markdownList[i].parsed.fragments) {
                    fragment.content = fragment.content.replaceAll(
                        markdownList[i].parsed.images[index],
                        `/api/files/${newName ?? ''}`,
                    );
                }
                if (markdownList[i].parsed.lastFragment) {
                    markdownList[i].parsed.lastFragment = markdownList[i].parsed.lastFragment.replaceAll(
                        markdownList[i].parsed.images[index],
                        `/api/files/${newName ?? ''}`,
                    );
                }
            };

            const allFiles = obj.attachments.map((file, j) => ({ file, callback: editAttachment(j) }));
            if (obj.firstAttachment) {
                allFiles.push({ file: obj.firstAttachment, callback: editFirstAttachment });
            }

            allFiles.push(...obj.images.map((file, j) => ({ file, callback: editImage(j) })));

            return Promise.all(
                allFiles.map((o) =>
                    (async () => {
                        const { file, callback } = o;
                        try {
                            logs.push(`开始上传${file.name}`);
                            const response = await upload(file, session.token);
                            if (!response.success) {
                                switch (response.reason) {
                                    case UploadFileFail.NOT_LOGGED_IN:
                                        logs.push(`上传${file.name}失败: 未登录`);
                                        break;
                                    case UploadFileFail.UNKNOWN:
                                        logs.push(`上传${file.name}失败: 未知错误`);
                                }
                                callback(false);
                                return;
                            }
                            logs.push(`上传${file.name}成功`);
                            callback(true, response.uploadedName);
                        } catch (e) {
                            logs.push(`上传 ${file.name}失败: 网络错误`);
                            callback(false);
                        }
                    })(),
                ),
            );
        }),
    );

    return markdownList.filter((i) => i.uploadSuccess).map((i) => ({ name: i.name, parsed: i.parsed }));
};

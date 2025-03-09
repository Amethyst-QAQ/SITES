import { myAlert } from '@/lib/my-alert';
import { request } from '@/request';
import { defineStore } from 'pinia';
import { StartLearningFail } from 'types/api/start-learning';
import { UploadLearnTimeFail, type LearnTimeRecord } from 'types/api/upload-learn-time';
import type { UserInfo } from 'types/api/user-info';
import { ref } from 'vue';

export const useSessionStore = defineStore(
    'session',
    () => {
        const loggedIn = ref(false);
        const token = ref('');
        const userId = ref(-1);
        const userInfo = ref<UserInfo | undefined>(undefined);

        const pendingLearnTimeRecord = ref<LearnTimeRecord | null>(null);
        const learnTimeRecords = ref<LearnTimeRecord[]>([]);
        const timeToken = ref<{ token: string; time: Date } | null>(null);
        const isLearning = ref(false);
        const timeRecordIntervalId = ref<number | null>(null);

        const initLearnTime = async () => {
            window.addEventListener('beforeunload', stopLearning);
            window.addEventListener('unload', stopLearning);
            window.addEventListener('pagehide', pauseLearning);
            window.addEventListener('pageshow', resumeLearning);

            if (timeRecordIntervalId.value) {
                clearInterval(timeRecordIntervalId.value);
                timeRecordIntervalId.value = null;
            }
            if (timeToken.value && (pendingLearnTimeRecord.value || learnTimeRecords.value.length > 0)) {
                await uploadLearnTime();
            }
            timeToken.value = null;
            isLearning.value = false;
            pendingLearnTimeRecord.value = null;
            learnTimeRecords.value = [];
            setInterval(
                () => {
                    if (
                        !isLearning.value &&
                        timeToken.value &&
                        (pendingLearnTimeRecord.value || learnTimeRecords.value.length > 0)
                    ) {
                        uploadLearnTime();
                    }
                },
                5 * 60 * 1000,
            );
        };

        const timeRecordIntervalFunc = () => {
            if (!timeToken.value) {
                myAlert.error('记录学习时间失败: 未知错误');
                return;
            }

            const time = Math.floor((new Date().getTime() - timeToken.value.time.getTime()) / 1000);

            if (!pendingLearnTimeRecord.value) {
                pendingLearnTimeRecord.value = {
                    from: time,
                    to: time,
                };
            } else {
                pendingLearnTimeRecord.value.to = time;
            }
        };

        const cleanSession = () => {
            loggedIn.value = false;
            token.value = '';
            userId.value = -1;
            userInfo.value = undefined;
            pendingLearnTimeRecord.value = null;
            learnTimeRecords.value = [];
            timeToken.value = null;
            isLearning.value = false;
            if (timeRecordIntervalId.value) {
                clearInterval(timeRecordIntervalId.value);
                timeRecordIntervalId.value = null;
            }
        };

        const uploadLearnTime = async () => {
            if (pendingLearnTimeRecord.value) {
                learnTimeRecords.value.push(pendingLearnTimeRecord.value!);
                pendingLearnTimeRecord.value = null;
            }
            try {
                const response = await request('/upload-learn-time', {
                    token: token.value,
                    requestNewToken: true,
                    timeToken: timeToken.value!.token,
                    data: learnTimeRecords.value,
                });
                if (!response.success) {
                    switch (response.reason) {
                        case UploadLearnTimeFail.NOT_LOGGED_IN:
                            myAlert.error('上传学习时间失败: 未登录');
                            cleanSession();
                            break;
                        case UploadLearnTimeFail.INVALID_DATA:
                            myAlert.error('上传学习时间失败: 数据错误');
                            learnTimeRecords.value = [];
                            break;
                        case UploadLearnTimeFail.UNKNOWN:
                            myAlert.error('上传学习时间失败: 未知错误');
                            break;
                    }
                    return;
                }

                timeToken.value = { token: response.timeToken, time: new Date() };
            } catch (e) {
                myAlert.error('上传学习时间失败: 网络错误');
            }
        };

        const startLearning = async () => {
            if (!loggedIn.value || isLearning.value) {
                return;
            }
            if (pendingLearnTimeRecord.value) {
                learnTimeRecords.value.push(pendingLearnTimeRecord.value!);
                pendingLearnTimeRecord.value = null;
            }
            if (!timeToken.value) {
                try {
                    const response = await request('/start-learning', {
                        token: token.value,
                    });
                    if (!response.success) {
                        switch (response.reason) {
                            case StartLearningFail.NOT_LOGGED_IN:
                                myAlert.error('开始学习失败: 未登录');
                                cleanSession();
                                break;
                            case StartLearningFail.UNKNOWN:
                                myAlert.error('开始学习失败: 未知错误');
                                break;
                        }
                        return;
                    }
                    timeToken.value = { token: response.timeToken, time: new Date() };
                    isLearning.value = true;
                    timeRecordIntervalId.value = setInterval(timeRecordIntervalFunc, 1000);
                } catch (e) {
                    myAlert.error('开始学习失败: 网络错误');
                }
            }
        };

        const stopLearning = async () => {
            if (!isLearning.value) {
                return;
            }

            if (timeRecordIntervalId.value) {
                clearInterval(timeRecordIntervalId.value);
                timeRecordIntervalId.value = null;
            }
            if (pendingLearnTimeRecord.value) {
                learnTimeRecords.value.push(pendingLearnTimeRecord.value!);
                pendingLearnTimeRecord.value = null;
            }
            isLearning.value = false;
        };

        const pauseLearning = () => {
            if (timeRecordIntervalId.value) {
                clearInterval(timeRecordIntervalId.value);
                timeRecordIntervalId.value = null;
            }
            if (pendingLearnTimeRecord.value) {
                learnTimeRecords.value.push(pendingLearnTimeRecord.value!);
                pendingLearnTimeRecord.value = null;
            }
        };

        const resumeLearning = () => {
            if (!isLearning.value) {
                return;
            }
            timeRecordIntervalId.value = setInterval(timeRecordIntervalFunc, 1000);
        };

        return {
            loggedIn,
            token,
            userId,
            userInfo,
            cleanSession,
            initLearnTime,
            startLearning,
            stopLearning,
            isLearning,
        };
    },
    {
        persist: {
            storage: localStorage,
        },
    },
);

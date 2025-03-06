import { defineStore } from 'pinia';
import { ref } from 'vue';

type UserInfo = {
    username: string;
    nickname: string;
};

export const useSessionStore = defineStore(
    'session',
    () => {
        const loggedIn = ref(false);
        const token = ref('');
        const userInfo = ref<UserInfo | undefined>(undefined);
        return { loggedIn, token, userInfo };
    },
    {
        persist: {
            storage: sessionStorage,
        },
    },
);

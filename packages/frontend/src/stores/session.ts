import { defineStore } from 'pinia';
import type { UserInfo } from 'types/api/user-info';
import { ref } from 'vue';

export const useSessionStore = defineStore(
    'session',
    () => {
        const loggedIn = ref(false);
        const token = ref('');
        const userId = ref(-1);
        const userInfo = ref<UserInfo | undefined>(undefined);
        return { loggedIn, token, userId, userInfo };
    },
    {
        persist: {
            storage: sessionStorage,
        },
    },
);

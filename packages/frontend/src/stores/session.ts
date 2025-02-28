import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSessionStore = defineStore(
    'session',
    () => {
        const loggedIn = ref(false);
        const token = ref('');
        return { loggedIn, token };
    },
    {
        persist: true,
    },
);

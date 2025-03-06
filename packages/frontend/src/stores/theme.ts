import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useThemeStore = defineStore(
    'theme',
    () => {
        const isDark = ref(false);
        return { isDark };
    },
    {
        persist: {
            storage: localStorage,
        },
    },
);

import { ElNotification, type NotificationOptions } from 'element-plus';

const myAlertCore = (message: string, options?: Omit<NotificationOptions, 'message'>) => {
    ElNotification({ message, ...options });
};

type Options = Omit<NotificationOptions, 'type' | 'message'>;

const myAlertCorePrototype = {
    info: (message: string, options?: Options) => {
        ElNotification({ type: 'info', message, ...options });
    },
    success: (message: string, options?: Options) => {
        ElNotification({ type: 'success', message, ...options });
    },
    warning: (message: string, options?: Options) => {
        ElNotification({ type: 'warning', message, ...options });
    },
    error: (message: string, options?: Options) => {
        ElNotification({ type: 'error', message, ...options });
    },
};

for (const key in myAlertCorePrototype) {
    (myAlertCore as Record<string, any>)[key] = myAlertCorePrototype[key as keyof typeof myAlertCorePrototype];
}

export const myAlert = myAlertCore as typeof myAlertCore & typeof myAlertCorePrototype;

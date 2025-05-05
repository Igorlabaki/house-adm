import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { router } from 'expo-router';

interface NotificationData {
    type: string;
    proposalId: string;
}

export class NotificationService {
    private static instance: NotificationService;
    private notificationListener: Notifications.Subscription | null = null;
    private responseListener: Notifications.Subscription | null = null;

    private constructor() {
        this.configureNotifications();
        this.setupNotificationListeners();
    }

    public static getInstance(): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    private async configureNotifications() {
        // Configurar o comportamento das notificações
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: true,
                shouldShowBanner: true,
                shouldShowList: true,
            }),
        });

        // Configurar o canal de notificações para Android
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }
    }

    private setupNotificationListeners() {
        // Listener para notificações em primeiro plano
        this.notificationListener = Notifications.addNotificationReceivedListener(notification => {
            // Aqui você pode atualizar o estado global ou local com a nova notificação
            console.log('Notificação recebida:', notification);
        });

        // Listener para quando o usuário toca na notificação
        this.responseListener = Notifications.addNotificationResponseReceivedListener(response => {
            const rawData = response.notification.request.content.data;
            const data = rawData as unknown as NotificationData;
            
            // Navegação baseada no tipo de notificação
            if (data.type === 'PROPOSAL' && data.proposalId) {
                router.push({
                    pathname: '/budgets/[id]',
                    params: { id: data.proposalId }
                });
            }
            // Adicione mais tipos de notificação conforme necessário
        });
    }

    public async registerForPushNotifications(): Promise<string | null> {
        let token;

        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                console.log('Permissão para notificações não concedida');
                return null;
            }

            token = (await Notifications.getExpoPushTokenAsync()).data;
        } else {
            console.log('Dispositivo físico necessário para notificações push');
        }

        return token || null;
    }

    public async getPushToken(): Promise<string | null> {
        return this.registerForPushNotifications();
    }

    public cleanup() {
        if (this.notificationListener) {
            this.notificationListener.remove();
        }
        if (this.responseListener) {
            this.responseListener.remove();
        }
    }
} 
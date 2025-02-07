import { NotificationType } from "type";

interface fetchNotificacoesProps {
  notifications: NotificationType[]
  setList: React.Dispatch<
    React.SetStateAction<{
      orcamentos: any[];
      evento: any[];
      visitas: any[];
      outros: any[];
      todos: any[];
    }>
  >;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const fetchNotificacoes = async ({
  setList,
  setLoading,
  notifications
}: fetchNotificacoesProps) => {
  setLoading(true);
  try {
  
    // Inicializa as listas categorizadas
    const categorizedNotifications = {
      orcamentos: [],
      evento: [],
      visitas: [],
      outros: [],
      todos: [],
    };
    
    // Classifica as notificações em uma única passagem
    notifications.map((notification: NotificationType) => {
      if (notification.type === "PROPOSAL") {
        categorizedNotifications.orcamentos.push(notification);
        categorizedNotifications.todos.push(notification);
      } else if (notification.type === "EVENT") {
        categorizedNotifications.evento.push(notification);
        categorizedNotifications.todos.push(notification);
      } else if (notification.type === "VISIT") {
        categorizedNotifications.visitas.push(notification);
        categorizedNotifications.todos.push(notification);
      } else if (notification.type === "ALERT") {
        categorizedNotifications.outros.push(notification);
        categorizedNotifications.todos.push(notification);
      }
    });

    setList(categorizedNotifications);
  } catch (error) {
    console.error("Erro ao buscar notificações:", error);
  } finally {
    setLoading(false);
  }
};

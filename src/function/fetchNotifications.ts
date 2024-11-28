import { SERVER_URL } from "@env";
import { RootState } from "@store/index";
import { useSelector } from "react-redux";
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
    notifications.forEach((notification: NotificationType) => {
      if (notification.type === "ORCAMENTO") {
        categorizedNotifications.orcamentos.push(notification);
        categorizedNotifications.todos.push(notification);
      } else if (notification.type === "EVENTO") {
        categorizedNotifications.evento.push(notification);
        categorizedNotifications.todos.push(notification);
      } else if (notification.type === "VISITA") {
        categorizedNotifications.visitas.push(notification);
        categorizedNotifications.todos.push(notification);
      } else if (notification.type === "ALERTA") {
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

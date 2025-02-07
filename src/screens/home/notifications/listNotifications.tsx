import { ItemSeparatorList } from "@components/list/itemSeparatorList";
import { ListEmpty } from "@components/list/ListEmpty";
import { ActivityIndicator, FlatList, RefreshControl } from "react-native";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { useEffect, useState } from "react";
import { NotificationType } from "type";
import { styled } from "nativewind";

import { SERVER_URL } from "@env";
import { NotificationItemFlatList } from "./notificationItemFlatList";
import {
  Pusher,
  PusherMember,
  PusherChannel,
  PusherEvent,
} from "@pusher/pusher-websocket-react-native";
import { Entypo } from "@expo/vector-icons";
import { fetchNotificacoes } from "function/fetchNotifications";
import { fetchNotificationsList } from "@store/notifications/notificationsSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/index";

/* import { Pusher, PusherEvent } from '@pusher/pusher-websocket-react-native'; */

export const StyledFlatList = styled(FlatList<NotificationType>);

export default function ListNotifications() {
  const [listType, setListType] = useState("TODOS");
  const [notificationsLists, setNotificationsLists] = useState({
    orcamentos: [],
    evento: [],
    visitas: [],
    outros: [],
    todos: [],
  });
  const [notificationsLoading, setNotificationsLoading] =
    useState<boolean>(false);

  const notifications  = useSelector(
    (state: RootState) => state.notificationList.notifications
  );
  
  useEffect(() => {
    setNotificationsLoading(true);
    fetchNotificacoes({
      notifications,
      setList: setNotificationsLists,
      setLoading: setNotificationsLoading,
    });
  }, [notifications]);

  function renderList(type: string) {
    if (type === "ORCAMENTO") {
      return notificationsLists.orcamentos;
    }
    if (type === "VISITA") {
      return notificationsLists.visitas;
    }
    if (type === "EVENTO") {
      return notificationsLists.evento;
    }
    if (type === "ALERTA") {
      return notificationsLists.outros;
    }

    return notificationsLists.todos;
  }

  useEffect(() => {
    renderList(listType);
  }, [listType]);

  if (notificationsLoading) {
    return (
      <StyledView className="h-full w-full flex justify-center items-center">
        <ActivityIndicator size="large" color="white" />
        <StyledText className="text-white">Loading</StyledText>
      </StyledView>
    );
  }

  return (
    <>
      <StyledText className="font-semibold text-custom-white pt-5">
        Ultimas notificacoes:
      </StyledText>
      <StyledView className="flex justify-start items-center flex-row pb-5 gap-x-5 pt-2">
        <StyledView className="flex flex-row gap-x-1 justify-center items-center">
          <StyledText className=" text-custom-white text-[12.5px]">
            Orc.({notificationsLists.orcamentos.length})
          </StyledText>
          <StyledPressable
            className="w-3 h-3 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center"
            onPress={() => {
              if (listType === "ORCAMENTO") {
                setListType("TODOS");
              } else {
                setListType("ORCAMENTO");
              }
            }}
          >
            {listType === "ORCAMENTO" && (
              <Entypo name="check" size={10} color="white" />
            )}
          </StyledPressable>
        </StyledView>
        <StyledView className="flex flex-row gap-x-1 justify-center items-center">
          <StyledText className=" text-custom-white text-[12.5px]">
            Evento({notificationsLists.evento.length})
          </StyledText>
          <StyledPressable
            className="w-3 h-3 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center"
            onPress={() => {
              if (listType === "EVENTO") {
                setListType("TODOS");
              } else {
                setListType("EVENTO");
              }
            }}
          >
            {listType === "EVENTO" && (
              <Entypo name="check" size={10} color="white" />
            )}
          </StyledPressable>
        </StyledView>
        <StyledView className="flex flex-row gap-x-1 justify-center items-center">
          <StyledText className=" text-custom-white text-[12.5px]">
            Visita({notificationsLists.visitas.length})
          </StyledText>
          <StyledPressable
            className="w-3 h-3 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center"
            onPress={() => {
              if (listType === "VISITA") {
                setListType("TODOS");
              } else {
                setListType("VISITA");
              }
            }}
          >
            {listType === "VISITA" && (
              <Entypo name="check" size={10} color="white" />
            )}
          </StyledPressable>
        </StyledView>
        <StyledView className="flex flex-row gap-x-1 justify-center items-center">
          <StyledText className=" text-custom-white text-[12.5px]">
            Outros({notificationsLists.outros.length})
          </StyledText>
          <StyledPressable
            className="w-3 h-3 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center"
            onPress={() => {
              if (listType === "ALERTA") {
                setListType("TODOS");
              } else {
                setListType("ALERTA");
              }
            }}
          >
            {listType === "ALERTA" && (
              <Entypo name="check" size={10} color="white" />
            )}
          </StyledPressable>
        </StyledView>
      </StyledView>
      <StyledFlatList
        removeClippedSubviews={false}
        keyExtractor={(item: NotificationType) => item.id}
        data={renderList(listType)}
        renderItem={({ item }: { item: NotificationType }) => {
          return <NotificationItemFlatList notification={item} key={item.id} />;
        }}
        ItemSeparatorComponent={() => <ItemSeparatorList />}
        ListEmptyComponent={() => <ListEmpty dataType="notificacao" />}
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={notificationsLoading}
            onRefresh={() =>
              fetchNotificacoes({
                notifications,
                setList: setNotificationsLists,
                setLoading: setNotificationsLoading,
              })
            }
          />
        }
      />
    </>
  );
}

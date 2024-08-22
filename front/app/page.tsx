"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Container, Flex } from "@radix-ui/themes";

import { useUserStore } from "@/stores/user";

import { Header } from "@/components/Header";
import { Lobby, RoomFormData } from "@/components/Lobby";

import { useRoomStore } from "@/stores/room";

import "./styles.scss";
import { GameRoom } from "@/components/GameRoom";
import { useWebSocket } from "@/context/WebSocketContext";
import { RoomService } from "@/services/room";
import { UserService } from "@/services/user";
import { GameBoard } from "@/components/GameBoard";

export default function Home() {
  const router = useRouter();
  const room = useRoomStore((state) => state.room);
  const isStarted = useRoomStore((state) => state.isStarted);

  const user = useUserStore((state) => state.user);
  const userState = useRoomStore().userState(user);

  const { ws } = useWebSocket();
  const { setUser } = useUserStore();
  const { setRoom, start, finish } = useRoomStore();

  const roomService = useMemo(
    () =>
      new RoomService({
        ws,
        setRoom,
        start,
        finish,
      }),
    [finish, setRoom, start, ws]
  );

  const userService = useMemo(
    () =>
      new UserService({
        ws,
        setUser,
      }),
    [setUser, ws]
  );

  const onJoinRoom = useCallback(
    (data: RoomFormData) => {
      if (!user) {
        return;
      }

      roomService.join(user, data.code);
    },
    [roomService, user]
  );

  const onCreateRoom = useCallback(() => {
    if (!user) {
      return;
    }

    roomService.create(user);
  }, [roomService, user]);

  const onLogout = useCallback(() => {
    if (!user) {
      return;
    }

    userService.delete(user.code);
  }, [user, userService]);

  const onStart = useCallback(() => {
    if (!room || !user) {
      return;
    }

    roomService.ready(user, room.uid);
  }, [room, roomService, user]);

  useEffect(() => {
    if (!user || !user.code) {
      router.push("/login");
    }
  }, [router, user]);

  return (
    <Flex direction="column" className="home" minHeight="100vh">
      <Header
        user={user}
        room={room}
        isStarted={isStarted}
        onLogout={onLogout}
      />
      <Container
        className="home-content py-6 px-10"
        height="400px"
        overflow="auto"
      >
        {user.code ? (
          room.uid ? (
            isStarted ? (
              <GameBoard />
            ) : (
              <GameRoom
                user={user}
                room={room}
                userState={userState}
                onStart={onStart}
              />
            )
          ) : (
            <Lobby
              user={user}
              onJoinRoom={onJoinRoom}
              onCreateRoom={onCreateRoom}
              onLogout={onLogout}
            />
          )
        ) : null}
      </Container>
    </Flex>
  );
}

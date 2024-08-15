"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Badge,
  Button,
  Container,
  Flex,
  Text,
  TextField,
} from "@radix-ui/themes";
import { ButtonIcon, ExitIcon, LockClosedIcon } from "@radix-ui/react-icons";

import { useUserStore } from "@/stores/user";

import { Header } from "@/components/Header";

import { RoomService } from "@/services/room";
import { UserService } from "@/services/user";
import { useRoomStore } from "@/stores/room";
import { useWebSocket } from "@/context/WebSocketContext";

import "./styles.scss";

interface RoomFormData {
  code: string;
}

export default function Lobby() {
  const user = useUserStore((state) => state.user);
  const room = useRoomStore((state) => state.room);
  const router = useRouter();

  const { ws } = useWebSocket();
  const { setUser } = useUserStore();
  const { setRoom } = useRoomStore();
  const { register, handleSubmit } = useForm<RoomFormData>();

  const roomService = useMemo(
    () =>
      new RoomService({
        ws,
        setRoom,
      }),
    [setRoom, ws]
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
      roomService.join(data.code);
    },
    [roomService]
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

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [router, user]);

  return (
    <Flex direction="column" className="lobby" minHeight="100vh">
      <Header />
      <Container className="lobby-content py-6" height="400px">
        <Flex direction="row" justify="between" height="100%">
          {!room && (
            <>
              <Flex
                direction="column"
                justify="between"
                height="100%"
                minHeight="400px"
              >
                <Flex direction="column" align="start" gap="2">
                  <Flex direction="column" gap="0">
                    <Text className="uppercase">Saudações,</Text>
                    <Text className="text-4xl font-game uppercase">
                      {user?.name}
                    </Text>
                    <Text className="uppercase font-bold">
                      O Verdadeiro rei de eldoria
                    </Text>
                  </Flex>
                  <Button
                    variant="surface"
                    size="2"
                    color="red"
                    onClick={onLogout}
                  >
                    <ExitIcon width={16} height={16} />
                    Sair da conta
                  </Button>
                </Flex>
                <Flex direction="column" align="start" gap="2">
                  <Text className="text-xs uppercase">Crie uma sala</Text>
                  <Button
                    variant="classic"
                    size="4"
                    className="font-game max-w-[200px]"
                    onClick={onCreateRoom}
                  >
                    Criar sala
                  </Button>
                  <Text className="text-xs uppercase">
                    ou entre em uma sala existente
                  </Text>
                  <form
                    className="flex w-full gap-2"
                    onSubmit={handleSubmit(onJoinRoom)}
                  >
                    <TextField.Root
                      placeholder="Id da sala"
                      mb="2"
                      size="3"
                      className="w-full"
                      {...register("code", { required: true })}
                    >
                      <TextField.Slot>
                        <LockClosedIcon width={16} height={16} />
                      </TextField.Slot>
                    </TextField.Root>
                    <Button type="submit" variant="classic" size="3">
                      Entrar
                    </Button>
                  </form>
                </Flex>
              </Flex>
              <Flex>
                <Text>Chat</Text>
                {/* TODO: Implement chat component */}
              </Flex>
            </>
          )}
        </Flex>
      </Container>
    </Flex>
  );
}

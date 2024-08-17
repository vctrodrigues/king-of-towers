import { useForm } from "react-hook-form";

import { ExitIcon, LockClosedIcon } from "@radix-ui/react-icons";
import { Flex, Text, Button, TextField } from "@radix-ui/themes";

import { User } from "@/types/user";
import { Chat } from "./Chat";

export interface RoomFormData {
  code: string;
}

interface LobbyProps {
  onLogout: () => void;
  onCreateRoom: () => void;
  onJoinRoom: (data: RoomFormData) => void;
  user: User;
}

export const Lobby = ({
  onLogout,
  onJoinRoom,
  onCreateRoom,
  user,
}: LobbyProps) => {
  const { register, handleSubmit } = useForm<RoomFormData>();

  return (
    <Flex direction="row" justify="between" className="w-full">
      <Flex
        direction="column"
        justify="between"
        height="100%"
        minHeight="400px"
      >
        <Flex direction="column" align="start" gap="2">
          <Flex direction="column" gap="0">
            <Text className="uppercase">Saudações,</Text>
            <Text className="text-4xl font-game uppercase">{user?.name}</Text>
            <Text className="uppercase font-bold">
              O Verdadeiro rei de eldoria
            </Text>
          </Flex>
          <Button variant="surface" size="2" color="red" onClick={onLogout}>
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
        <Chat />
      </Flex>
    </Flex>
  );
};

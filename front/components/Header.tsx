import Image from "next/image";
import { Container, Text, Flex, Button, Badge } from "@radix-ui/themes";

import { Room } from "@/types/room";
import { User } from "@/types/user";
import { ExitIcon } from "@radix-ui/react-icons";
import { UserAvatar } from "./UserAvatar";
import { UserRole } from "@/enums/role";
import { UserCard } from "./UserCard";
import { useRoomStore } from "@/stores/room";

interface HeaderProps {
  room?: Room;
  user?: User;
  isStarted: boolean;
  onLogout: () => void;
}

export const Header = ({ room, user, isStarted, onLogout }: HeaderProps) => {
  const spectators = useRoomStore().spectators();
  const oponents = useRoomStore().oponents(user);

  return (
    <header>
      <Container>
        <Flex p="6" align="center" justify="between" className=" text-white">
          <Image
            src="/img/logo.png"
            width={126}
            height={113}
            alt="king of towers"
          />
          {room && user && (
            <Flex align="center" justify="between" width="100%" pl="8">
              {isStarted ? (
                <Flex>
                  {spectators.length > 0 && (
                    <Flex direction="column" gap="1" mr="3">
                      <Text size="1" weight="bold">
                        Espectadores
                      </Text>
                      <Flex gap="3">
                        {spectators.map((user) => (
                          <UserAvatar user={user} key={user.code} />
                        ))}
                      </Flex>
                    </Flex>
                  )}
                  {oponents.length > 0 && (
                    <Flex direction="column" gap="1" mr="3">
                      <Text size="1" weight="bold">
                        Oponente
                      </Text>
                      <Flex gap="3">
                        {oponents.map((user) => (
                          <UserCard user={user} key={user.code} tiny />
                        ))}
                      </Flex>
                    </Flex>
                  )}
                </Flex>
              ) : (
                <Flex>
                  <Text size="1" mr="4" className="uppercase">
                    ID da sala
                  </Text>
                  <Badge size="3" variant="surface" mr="4">
                    {room.uid}
                  </Badge>
                </Flex>
              )}
              <Flex align="center" gap="4">
                <Text className="font-game" size="6">
                  {user?.name}
                </Text>
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
            </Flex>
          )}
        </Flex>
      </Container>
    </header>
  );
};

import { Button, Flex, Text } from "@radix-ui/themes";
import { UserCard } from "./UserCard";
import { UserRoomState } from "@/enums/room";
import { Room } from "@/types/room";
import { User } from "@/types/user";

interface RoomProps {
  user: User;
  room: Room;
  userState: UserRoomState;
  onStart: () => void;
}

export const GameRoom = ({ user, room, userState, onStart }: RoomProps) => {
  return (
    <Flex direction="column" gap="2">
      <Text mb="4">Jogadores</Text>
      {room.users.map((user) => (
        <UserCard key={user.code} user={user} />
      ))}
      <Button
        disabled={
          [UserRoomState.Ready, UserRoomState.Playing].includes(userState) ||
          (room.users[0].code === user.code &&
            (room.users.length < 2 ||
              room.users
                .slice(1)
                .some(
                  (user) =>
                    user.role !== "player" || user.state !== UserRoomState.Ready
                )))
        }
        variant="classic"
        size="4"
        mt="8"
        className="font-game max-w-[200px]"
        onClick={onStart}
      >
        {room.users[0].code === user.code
          ? "Começar partida"
          : userState === UserRoomState.Waiting
          ? "Pronto"
          : "Aguardando"}
      </Button>
    </Flex>
  );
};

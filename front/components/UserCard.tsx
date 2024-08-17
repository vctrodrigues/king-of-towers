import { Avatar, Badge, BadgeProps, Flex, Text } from "@radix-ui/themes";
import { UserRoomConfig } from "@/types/room";

interface UserCardProps {
  user: UserRoomConfig;
  tiny?: boolean;
}

const Roles = {
  player: "Jogador",
  spectator: "Espectador",
};

const States: {
  [key: string]: { label: string; color: BadgeProps["color"] };
} = {
  waiting: {
    label: "Aguardando",
    color: "yellow",
  },
  ready: {
    label: "Pronto",
    color: "green",
  },
  playing: {
    label: "Jogando",
    color: "blue",
  },
  finished: {
    label: "Finalizado",
    color: "red",
  },
};

export const UserCard = ({ user, tiny }: UserCardProps) => {
  return (
    <Flex align="center">
      <Avatar
        variant="solid"
        size={tiny ? "3" : "5"}
        fallback={user.name[0]}
      ></Avatar>
      <Flex direction="column" ml="3">
        <Text className="font-game" size={tiny ? "5" : "7"}>
          {user.name}
        </Text>
        {!tiny && <Text>{Roles[user.role]}</Text>}
      </Flex>
      {!tiny && (
        <Badge
          variant="surface"
          size="2"
          color={States[user.state].color}
          ml="4"
        >
          {States[user.state].label}
        </Badge>
      )}
    </Flex>
  );
};

import { Avatar, Flex } from "@radix-ui/themes";
import { UserRoomConfig } from "@/types/room";

interface UserAvatarProps {
  user: UserRoomConfig;
}
export const UserAvatar = ({ user }: UserAvatarProps) => {
  return (
    <Flex align="center">
      <Avatar variant="solid" size="5" fallback={user.name[0]}></Avatar>
    </Flex>
  );
};

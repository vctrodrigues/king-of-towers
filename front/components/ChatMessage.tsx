import { User } from "@/types/user";
import { Flex, Text } from "@radix-ui/themes";

interface ChatMessageProps {
  user: User;
  text: string;
  date: string;
}

export const ChatMessage = ({ user, text, date }: ChatMessageProps) => {
  return (
    <Flex align="center" gap="1">
      <Text>{user.name}</Text>
      <Text>{text}</Text>
      <Text>{date}</Text>
    </Flex>
  );
};

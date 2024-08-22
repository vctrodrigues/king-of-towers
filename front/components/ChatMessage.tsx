import { User } from "@/types/user";
import { Flex, Text } from "@radix-ui/themes";

interface ChatMessageProps {
  user: User;
  text: string;
  date: string;
}

export const ChatMessage = ({ user, text, date }: ChatMessageProps) => {
  return (
    <Flex align="center" justify="between" gap="1">
      <Flex gap="1">
        <Text color="orange" weight="bold">
          {user.name}:{" "}
        </Text>
        <Text>{text}</Text>
      </Flex>
      <Text size="1" color="gray">
        {new Date(date).toLocaleString()}
      </Text>
    </Flex>
  );
};

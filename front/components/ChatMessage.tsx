import { User } from "@/types/user";
import { Flex, Text } from "@radix-ui/themes";
import { useEffect } from "react";

interface ChatMessageProps {
  user: User;
  text: string;
  date: string;
}

export const ChatMessage = ({ user, text, date }: ChatMessageProps) => {
  return (
    <Flex align="center" gap="1">
      <Text>{date}</Text>
      <Text color="yellow">{user.name}: </Text>
      <Text>{text}</Text>
    </Flex>
  );
};

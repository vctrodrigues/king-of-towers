import { Box, Button, Flex, TextField } from "@radix-ui/themes";

import { ChatMessage } from "./ChatMessage";

import { Message } from "@/types/chat";
import { useState } from "react";
import { User } from "@/types/user";

interface ChatProps {
  user: User;
}

export const Chat = ({ user }: ChatProps) => {
  const [message, setMessage] = useState<string>("");
  const [testeMessage, setTestMessage] = useState<Message[]>([]);
  const messages: Message[] = []; // to remove

  const sendMessage = (message: any) => {
    if (message) {
      const date = new Date();
      const newMessage: Message = {
        text: message,
        user: user,
        date: date.toLocaleTimeString(),
      };
      messages.push(...testeMessage, newMessage);

      setTestMessage(messages);
      setMessage("");

      const input: any = document.getElementById("input-text");
      if (input) input.value = "";
    }
  };

  return (
    <Flex
      direction="column"
      p="4"
      gap="2"
      justify="between"
      className="rounded-md bg-slate-900/50 backdrop-blur-md border-orange-500 border max-h-[400px] min-w-[400px]"
    >
      <Flex
        direction="column"
        gap="1"
        className="max-h-full overflow-auto"
        width="400px"
      >
        {testeMessage.map((message) => (
          <ChatMessage
            key={message.date}
            user={message.user}
            text={message.text}
            date={message.date}
          />
        ))}
      </Flex>
      <Flex direction="row" className="w-full h-fit">
        <TextField.Root
          onChange={(param) => setMessage(param.target?.value)}
          id={"input-text"}
          onKeyDown={(e) => (e.key === "Enter" ? sendMessage(message) : "")}
        >
          <TextField.Slot></TextField.Slot>
        </TextField.Root>
        <Button
          onClick={() => sendMessage(message)}
          style={{ marginLeft: "10px" }}
        >
          Enviar
        </Button>
      </Flex>
    </Flex>
  );
};

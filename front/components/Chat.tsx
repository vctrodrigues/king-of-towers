import { Button, Flex, TextField } from "@radix-ui/themes";

import { ChatMessage } from "./ChatMessage";

import { Message } from "@/types/chat";

export const Chat = () => {
  const messages: Message[] = []; // to remove

  const sendMessage = () => {};

  return (
    <Flex
      direction="column"
      p="4"
      gap="2"
      justify="between"
      className="rounded-md bg-slate-900/50 backdrop-blur-md border-orange-500 border max-h-[400px] min-w-[400px]"
    >
      <Flex direction="column" gap="1" className="max-h-full overflow-auto">
        {messages.map((message) => (
          <ChatMessage
            key={message.date}
            user={message.user}
            text={message.text}
            date={message.date}
          />
        ))}
      </Flex>
      <Flex direction="row" className="w-full h-fit">
        <TextField.Root>
          <TextField.Slot></TextField.Slot>
        </TextField.Root>
        <Button onClick={() => {}}>Enviar</Button>
      </Flex>
    </Flex>
  );
};

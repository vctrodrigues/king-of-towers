import { Button, Flex, TextField } from "@radix-ui/themes";

import { ChatMessage } from "./ChatMessage";

import { useCallback, useRef } from "react";
import { User } from "@/types/user";
import { useForm } from "react-hook-form";
import { ChatService } from "@/services/chat";
import { useChatStore } from "@/stores/chat";
import { useWebSocket } from "@/context/WebSocketContext";
import { useUserStore } from "@/stores/user";
import { Message } from "@/types/chat";

interface ChatProps {
  user: User;
}

interface ChatFormData {
  text: string;
}

export const Chat = ({ user }: ChatProps) => {
  const chatForm = useRef<HTMLFormElement>(null);
  const chat = useChatStore((state) => state.chat);

  const { ws } = useWebSocket();
  const { register, setValue, handleSubmit } = useForm<ChatFormData>();

  const { addMessage } = useChatStore();

  const chatService = new ChatService({
    ws,
    addMessage,
  });

  const onSubmit = useCallback(() => {
    chatForm.current?.submit();
  }, []);

  const onSendMessage = useCallback(
    (data: ChatFormData) => {
      chatService.sendMessage(data.text, user);
      setValue("text", "");
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user]
  );

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
        {chat.map((message: Message) => (
          <ChatMessage
            key={message.date}
            user={message.user}
            text={message.text}
            date={message.date}
          />
        ))}
      </Flex>
      <Flex direction="row" className="w-full h-fit">
        <form
          ref={chatForm}
          action=""
          method=""
          className="flex gap-2 w-full"
          onSubmit={handleSubmit(onSendMessage)}
        >
          <TextField.Root
            id={"input-text"}
            placeholder="Digite sua mensagem"
            className="w-full"
            {...register("text", { required: true })}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSubmit();
              }
            }}
          >
            <TextField.Slot></TextField.Slot>
          </TextField.Root>
          <Button type="submit">Enviar</Button>
        </form>
      </Flex>
    </Flex>
  );
};

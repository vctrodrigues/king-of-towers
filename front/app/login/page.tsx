"use client";

import { useEffect } from "react";
import { v4 as uuid } from "uuid";
import { useRouter } from "next/navigation";

import { PersonIcon } from "@radix-ui/react-icons";
import { Button, Flex, Heading, Text, TextField } from "@radix-ui/themes";
import { useForm } from "react-hook-form";

import { UserService } from "@/services/user";
import { useUserStore } from "@/stores/user";
import { useWebSocket } from "@/context/WebSocketContext";

import "./styles.scss";

interface LoginFormData {
  name: string;
}

export default function Login() {
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  const { setUser } = useUserStore();
  const { ws } = useWebSocket();

  const { register, handleSubmit } = useForm<LoginFormData>();

  const userService = new UserService({
    ws,
    setUser,
  });

  const onLoginSubmit = (data: LoginFormData) => {
    userService.create(data.name);
  };

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [router, user]);

  return (
    <Flex
      direction="row"
      className="w-full min-h-[100vh] bg-slate-950"
      align="center"
      justify="between"
    >
      <Flex className="w-[50%]" justify="center">
        <Flex
          direction="column"
          justify="center"
          p="6"
          gap="2"
          className="bg-slate-900/50 border h-fit w-full max-w-[400px] border-blue-400 rounded-md"
        >
          <Heading as="h1" className="font-game">
            Bem-vindo
          </Heading>
          <Text className="text-slate-500">
            Insira seu nome e entre no jogo.
          </Text>

          <form
            className="flex w-full gap-2"
            onSubmit={handleSubmit(onLoginSubmit)}
          >
            <TextField.Root
              placeholder="Seu nome"
              mb="2"
              className="w-full"
              {...register("name", { required: true })}
            >
              <TextField.Slot>
                <PersonIcon width={16} height={16} />
              </TextField.Slot>
            </TextField.Root>
            <Button type="submit" variant="classic">
              Entrar
            </Button>
          </form>
        </Flex>
      </Flex>
      <Flex className="login-background w-[50%] h-[100vh]"></Flex>
    </Flex>
  );
}

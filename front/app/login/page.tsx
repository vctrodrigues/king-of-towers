import { PersonIcon } from "@radix-ui/react-icons";
import {
  Button,
  Container,
  Flex,
  Heading,
  Text,
  TextField,
} from "@radix-ui/themes";

import "./styles.scss";

export default function Login() {
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
          <Heading as="h1">Bem-vindo</Heading>
          <Text>Insira seu nome e entre no jogo.</Text>
          <Flex direction="row" gap="2">
            <TextField.Root placeholder="Seu nome" mb="2" className="w-full">
              <TextField.Slot>
                <PersonIcon width={16} height={16} />
              </TextField.Slot>
            </TextField.Root>
            <Button type="submit" variant="classic">
              Entrar
            </Button>
          </Flex>
        </Flex>
      </Flex>
      <Flex className="login-background w-[50%] h-[100vh]"></Flex>
    </Flex>
  );
}

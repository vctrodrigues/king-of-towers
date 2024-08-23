# 🏰 King of Towers 🏰

> King of Towers é um jogo feito para a matéria de Jogos em Rede Multiusuários no Instituto Metrópole Digital/UFRN Tecnologia da Informação

## Tecnologia

Utilizamos duas principais tecnologias

1. JavaScript/TypeScript
2. WebSockets

### Frontend

Para o front-end utilizamos:
- React e TypeScript
- Redux para gerenciamento de estado
- Radix para estilização
- NextJs
- Excalibur como Game Engine


### Backend

Para o back-end:

- TypeScript
- NodeJS (sem framework como Nest ou Express)

## Como executar

- Clone o repositório
- Abra dois terminais, um para o front e outro para o back.

### Executando frontend

```bash
cd front
npm i
npm run dev           
```

### Executando backend

```bash
cd back
npm i
npm run start
```

## Como jogar

1. Acesse: localhost:3000/login
2. Insira seu nome para o jogo
3. Clique em entrar
4. Você estará no lobby do jogo e poderá conversar em chat
5. Clique em criar sala para oferecer o codigo ou insira o codigo de outra sala
6. Para o host iniciar a partida o jogador convidado precisa atualizar o status para pronto.
7. Inicie a partida
8. Divirta-se!

## Importante
- A Branch com o jogo estável é a feat/game;
- Sempre garantir que o local storage do localhost esteja vazio antes de iniciar a partida.

# 🏰 King of Towers 🏰

> King of Towers é um jogo feito para a matéria de Jogos em Rede Multiusuários no Instituto Metrópole Digital/UFRN Tecnologia da Informação

## Integrantes do grupo
VICTOR RAPHAELL VIEIRA

LUIS FELIPE ALIPIO

## Tecnologia

### Front-end

Para o front-end utilizamos:

- Next.js e TypeScript
- Zustand para gerenciamento de estado
- Radix como library de components
- Excalibur como game engine

### Back-end

Para o back-end:

- TypeScript
- NodeJS (sem framework)

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

1. Acesse: localhost:3000
2. Insira seu nome para o jogo
3. Clique em entrar
4. Você estará no lobby do jogo e poderá conversar em chat
5. Clique em criar sala para oferecer o codigo ou insira o codigo de outra sala
6. Para o host iniciar a partida o jogador convidado precisa atualizar o status para pronto.
7. Inicie a partida
8. Divirta-se!

> Importante: Se acontecer algo fora do esperado, você pode limpar os dados do navegador: basta abrir as ferramentas de desenvolvedor, clicar na aba de `aplicação` e limpar os dados do `localStorage`.

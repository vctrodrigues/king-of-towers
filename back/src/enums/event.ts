export enum EventName {
  UserCreate = "user:create",
  UserRetrieve = "user:retrieve",
  UserDelete = "user:delete",

  RoomCreate = "room:create",
  RoomJoin = "room:join",
  RoomMove = "room:move",
  RoomUpdate = "room:update",
  RoomInvite = "room:invite",
  RoomInviteAnswer = "room:invite:answer",
  RoomReady = "room:ready",
  RoomStart = "room:start",
  RoomFinish = "room:finish",
  RoomDestroy = "room:destroy",

  GameCreate = "game:create",
  GameUpdate = "game:update",
  GameDestroy = "game:destroy",
  GameSpawn = "game:spawn",
  GameMove = "game:move",
  GameAttack = "game:attack",
  GameDeffend = "game:deffend",
  GameOver = "game:over",

  ChatMessage = "chat:message",
}

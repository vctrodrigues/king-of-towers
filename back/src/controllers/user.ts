import WebSocket from "ws";

import { userService } from "../service/user";
import { serialize } from "../utils/serialize";
import { DBService } from "../service/db";
import { User } from "../types/user";

export const userController = (ws: WebSocket, dbService: DBService<User>) => {
  const _userService = userService(dbService);

  return {
    create: ({ name, session }: { name: string; session: string }) => {
      console.log(`> Creating user: ${name}`);

      try {
        const user = _userService.create(name, session);

        console.log(`> User created: ${user.name}`);
        ws.send(serialize("user:create", user));

        return user;
      } catch (error) {
        console.log(`> Error creating user: ${name}`);
        ws.send(serialize("user:create", { error: error.message }, false));
      }
    },

    get: ({ code }: { code: string }) => {
      console.log(`> Getting user: ${code}`);

      try {
        const user = _userService.get(code);

        console.log(`> User retrieved: ${user.name}`);
        ws.send(serialize("user:get", user));
      } catch (error) {
        console.log(`> Error getting user: ${code}`);
        ws.send(serialize("user:get", { error: error.message }, false));
      }
    },

    getBySession: ({ session }: { session: string }) => {
      console.log(`> Getting user by session: ${session}`);

      try {
        const user = dbService.find({ session });

        console.log(`> User retrieved: ${user.name}`);
        ws.send(serialize("user:get", user));

        return user;
      } catch (error) {
        console.log(`> Error getting user by session: ${session}`);
        ws.send(serialize("user:get", { error: error.message }, false));
      }
    },

    delete: ({ code }: { code: string }) => {
      console.log(`> Removing user: ${code}`);

      try {
        const user = _userService.delete(code);

        console.log(`> User removed: ${user.name}`);
        ws.send(serialize("user:delete", user));
      } catch (error) {
        console.log(`> Error removing user: ${code}`);
        ws.send(serialize("user:delete", { error: error.message }, false));
      }
    },

    deleteBySession: ({ session }: { session: string }) => {
      console.log(`> Removing user by session: ${session}`);

      try {
        const user = dbService.delete({ session });

        console.log(`> User removed: ${user?.name}`);
        ws.send(serialize("user:delete", user));
      } catch (error) {
        console.log(`> Error removing user by session: ${session}`);
        ws.send(serialize("user:delete", { error: error.message }, false));
      }
    },
  };
};

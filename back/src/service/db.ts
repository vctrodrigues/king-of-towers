type WhereOptions<Model> = {
  [key in keyof Model]?: Model[key];
};

type UpdateOptions<Model> = Array<keyof Model>;

interface FindOptions {
  cursor?: string;
  limit?: number;
}

export const dbService = <Model>(
  idKey: keyof Model,
  initialValue?: Model[]
) => {
  let value = initialValue ?? [];

  return {
    findAll(options?: FindOptions) {
      if (options?.cursor) {
        const cursorIndex = value.findIndex(
          (item) => item[idKey] === options.cursor
        );
        value = value.slice(cursorIndex + 1);
      }

      return value;
    },

    find(where: WhereOptions<Model>) {
      return value.find((item) => {
        return Object.keys(where).every((key) => {
          return item[key as keyof Model] === where[key as keyof Model];
        });
      });
    },

    update(
      newValue: Model,
      where: WhereOptions<Model>,
      which?: UpdateOptions<Model>
    ) {
      let updated: Model | undefined;

      value = value.map((item) => {
        if (
          Object.keys(where).every(
            (key) => item[key as keyof Model] === where[key as keyof Model]
          )
        ) {
          if (which) {
            which.forEach((key) => {
              item[key] = newValue[key];
            });

            newValue = item;
          }

          updated = newValue;
          return newValue;
        }

        return item;
      });

      return updated;
    },

    delete(where: WhereOptions<Model>) {
      let deleted: Model | undefined;

      value = value.filter((item) => {
        if (
          Object.keys(where).every(
            (key) => item[key as keyof Model] === where[key as keyof Model]
          )
        ) {
          deleted = item;
          return false;
        }

        return true;
      });

      return deleted;
    },

    save(newValue: Model) {
      value.push(newValue);

      return newValue;
    },
  };
};

export type DBService<Model> = {
  findAll(options?: FindOptions): Model[];
  find(where: WhereOptions<Model>): Model | undefined;
  update(newValue: Model, where: WhereOptions<Model>): Model | undefined;
  delete(where: WhereOptions<Model>): Model | undefined;
  save(newValue: Model): Model;
};

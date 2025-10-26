import type { Dispatch } from "react";
import useStorage from "use-local-storage";
import type { ZodType } from "zod";

type Setter<T> = Dispatch<React.SetStateAction<T | undefined>>;

type UseLocalStorage<T> = [T, Setter<T>];

export const useLocalStorage = <T>(
  key: string,
  defaultValue: T,
  schema?: ZodType,
): UseLocalStorage<T> => {
  const [storage, setStorage] = useStorage(key, defaultValue);

  const validatedStorage = ((): T => {
    if (!schema) return storage;

    try {
      return schema.parse(storage) as T;
    } catch (error) {
      setStorage(defaultValue);

      return defaultValue;
    }
  })();

  return [validatedStorage, setStorage];
};

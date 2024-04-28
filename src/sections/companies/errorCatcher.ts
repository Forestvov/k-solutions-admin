import type { UseFormSetError } from 'react-hook-form/dist/types/form';

export const errorCatcher = (error: any, setError: UseFormSetError<any>) => {
  // @ts-ignore
  error.inner?.map((inner, index) => {
    const { type, path, errors } = inner;
    return setError(path, { type, message: errors[index] });
  });
};

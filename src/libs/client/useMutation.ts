import { useState } from "react";

interface MutationState<T> {
  loading: boolean;
  data?: T;
  error?: object;
}

type MutationResult<T> = [(url: string, data?: any) => void, MutationState<T>];

interface methodsType {
  method?: "POST"|"DELETE",
}

export default function useMutation<T = any>({ method="POST" }: methodsType = {}): MutationResult<T> {
  const [state, setState] = useState<MutationState<T>>({
    loading: false,
    data: undefined,
    error: undefined,
  });

  function mutation(url:string, data?: any) {
    setState((prev) => ({ ...prev, loading: true }));
    fetch(url, {
      method:method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) =>
        response.json().catch((error) => {
          console.log(error);
        })
      )
      .then((data) => setState((prev) => ({ ...prev, data })))
      .catch((error) => setState((prev) => ({ ...prev, error })))
      .finally(() => setState((prev) => ({ ...prev, loading: false })));
  }

  return [mutation, { ...state }];
}

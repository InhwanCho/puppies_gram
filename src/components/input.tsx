import { cls } from "@/libs/client/utils";
import { UseFormRegisterReturn } from "react-hook-form";

interface InputProps {
  type: string;
  placeholder?: string;
  required: boolean;
  minLength?: number;
  maxLength?: number;
  register: UseFormRegisterReturn;
  error?: string;
  width?: string;
}

export default function input({
  type,
  placeholder,
  required,
  register,
  minLength,
  maxLength,
  error,
  width,
}: InputProps) {
  return (
    <>
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        {...register}
        className={cls(
          "p-3 bg-white rounded-lg focus:outline-none focus:drop-shadow-md",
          width ? width : "w-full"
        )}
      />
      {error ? <span>{error}</span> : null}
    </>
  );
}
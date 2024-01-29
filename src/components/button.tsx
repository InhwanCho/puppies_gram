import { cls } from "@/libs/client/utils";


interface ButtonProps {
  type?: "button" | "submit";
  text: string;
  isGradient?: boolean;
  isRounded?: boolean;
  width?: string;
  [key: string]: any;
}

export default function Button({ type,
  text,
  isGradient,
  isRounded,
  onClick,
  width,
}: ButtonProps) {
  return (
    <button
      type={type || "submit"}
      className={cls(
        "rounded-lg bg-amber-500/60 hover:bg-amber-500/80 text-slate-900 p-2",
        isGradient ? "bg-gradient-to-r from-amber-50/70 to-orange-50/40" : "",
        isRounded ? "rounded-3xl" : "",
        width ? width : "w-full"
      )}
      onClick={onClick}
    >
      {text}
    </button>
  );
}




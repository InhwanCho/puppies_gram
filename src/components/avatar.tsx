import Image from "next/image";
import { UseFormRegisterReturn } from "react-hook-form";

interface AvatarProps {
  avatar: string;
  index: number;
  avatarRegister: UseFormRegisterReturn;
}

const Avatar = ({ avatar, index, avatarRegister }: AvatarProps) => {
  return (
    <label htmlFor={avatar} className="mx-4 my-1.5">
      <input
        type="radio"
        id={avatar}
        value={avatar}
        className="w-[12px] h-[12px] rounded-full border-2"
        {...avatarRegister}
      />
      <Image
        priority={true}
        width={60}
        height={60}
        src={`/images/avatar/${avatar}.png`}
        alt={`아바타 캐릭터 ${index}`}
        className="w-[90px] h-[90px] rounded-full object-contain border cursor-pointer"
      />
    </label>
  );
};

export default Avatar;

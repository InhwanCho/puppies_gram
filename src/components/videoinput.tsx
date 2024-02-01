import { WriteForm } from "@/pages/post/write";
import { UseFormRegister } from "react-hook-form";

interface VideoInputProps {
  register: UseFormRegister<WriteForm>,
  previewStart: () => void;
  previewDelete: () => void;
}

export default function videoinput({
  register, previewStart,
  previewDelete }: VideoInputProps) {
  const regex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  return (
    <div className="flex flex-col">
      <label
        htmlFor={'video'}
        className="flex rounded-md border border-dashed mb-5"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="#DAB1FF"
          className="w-6 h-6 mx-3 my-2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
        </svg>
        <input
          type="text"
          id={'video'}
          placeholder={`유튜브 URL을 입력해주세요.`}
          className="w-full pl-3 pr-1 py-1 border-x border-dashed text-sm focus:outline-none"
          {...register('video', {
            pattern: {
              value: regex,
              message: `※ 올바른 유튜브 URL을 입력해주세요. "(Youtube Shorts 업로드 불가)"
                }`,
            },
            onChange: previewStart,
          })}
        />
        <button
          type="button"
          onClick={previewDelete}
          className="px-3 whitespace-nowrap text-xs text-gray-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.3"
            stroke="#FD7B80"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </button>
      </label>
    </div>
  )
}

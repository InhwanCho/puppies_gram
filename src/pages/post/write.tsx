
import Button from "@/components/button";
import Layout from "@/components/layout";
import Videoinput from "@/components/videoinput";
import VideoPlayer from "@/components/videoplayer";
import useMutation from "@/libs/client/useMutation";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export interface WriteForm {
  content: string;
  image?: FileList;
  video?: string;
}

export default function Write() {
  const {
    register,
    handleSubmit,
    getValues,
    resetField,
    watch,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<WriteForm>({ mode: 'onSubmit' });

  const router = useRouter()
  const [write, { loading, data }] = useMutation()
  const onVaild = async ({ content, image, video }: WriteForm) => {
    if (loading) return
    if (image && image.length > 0) {
      const { id, uploadURL } = await (await fetch(`/api/files`)).json()
      const form = new FormData
      form.append('file', image[0], image[0].name)
      await (await fetch(uploadURL, {
        method: "POST",
        body: form
      })).json()
      if (video) {
        video = videoPreview;
      }
      write(`/api/posts/write`, { content, video, imageId: id });
    } else {
      if (video) {
        video = videoPreview;
      }
      write(`/api/posts/write`, { content, video });
    }
    reset();
  }

  useEffect(() => {
    if (data?.ok) {
      router.push('/');
    }
  }, [data, router])

  //이미지
  const photo = watch('image')
  const [photoPreview, setPhotoPreview] = useState('')
  useEffect(() => {
    if (photo && photo.length > 0) {
      const file = photo[0]
      setPhotoPreview(URL.createObjectURL(file))
    }
  }, [photo])

  //동영상

  const [videoPreview, setVideoPreview] = useState("");
  console.log(videoPreview)
  const onVideoPreviewStart = () => {
    const urlInput = getValues("video");
    const regex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    if (urlInput === "") {
      setVideoPreview("");
      return;
    }

    const match = urlInput?.match(regex);

    if (match && match[7].length === 11) {
      setVideoPreview(match[7]);
    } else {
      setVideoPreview("");
    }
  };
  const onVideoPreviewDelete = () => {
    setVideoPreview("");
    resetField("video");
  };

  return (
    <Layout pageTitle="Write" hasBackBtn>
      <form
        onSubmit={handleSubmit(onVaild)}
        className="w-full px-5 pb-20 flex flex-col"
      >
        {/* 이미지 첨부 영역 */}
        {photoPreview ? <div className="youtubeContainer rounded-md border"><Image alt="image" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" src={photoPreview} className="youtubeContaineriframe object-contain" /></div> : <label className="w-full mb-8 cursor-pointer text-gray-600 hover:border-amber-500/80 hover:text-amber-500/80 flex items-center justify-center border-2 border-dashed border-gray-300 h-[17rem] rounded-md">
          <svg
            className="h-14 w-14"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input {...register('image')}
            type="file"
            className="hidden"
            accept="image/*" />
        </label>}

        {/* 동영상 첨부 영역 */}
        {/* preview */}
        {videoPreview ? <VideoPlayer videoId={videoPreview} /> : null}
        {/* 첨부 폼 */}
        <Videoinput register={register} previewStart={onVideoPreviewStart} previewDelete={onVideoPreviewDelete} />





        {/* 글 작성 영역 */}
        <textarea
          placeholder="여기에 글을 작성해 주세요."
          required={true}
          {...register("content", {
            required: '글을 입력해주세요',
            minLength: {
              value: 5,
              message: '5글자 이상 입력해주세요.'
            },
            maxLength: {
              value: 500,
              message: '500글자 이하로 입력해주세요.'
            }
          })}
          minLength={1}
          className="w-full h-40 p-3 mb-5 rounded-md bg-slate-100/80 placeholder:text-slate-500 focus:outline-none"
        />



        {/* 등록 버튼 */}
        <Button text={isSubmitting ? "등록 중..." : "등록"} isLarge isGradient isRounded />
        <p className="text-red-400 mt-4 text-lg text-center font-semibold">{errors.content?.message?.toString()}</p>
      </form>
    </Layout>
  );
};



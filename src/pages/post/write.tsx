
import Button from "@/components/button";
import Layout from "@/components/layout";
import useMutation from "@/libs/client/useMutation";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface WriteForm {
  content: string;
  image?: string;
  video?: string;
}

export default function Write() {
  const {
    register,
    handleSubmit,
    getValues,
    resetField,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<WriteForm>({ mode: 'onSubmit' });

  const router = useRouter()
  const [write, { loading, data }] = useMutation()
  const onVaild = (form: WriteForm) => {
    if (loading) return
    write(`/api/posts/write`, form);
    reset();
  }

  useEffect(() => {
    if (data?.ok) {
      router.push('/');
    }
  }, [data, router])

  return (
    <Layout pageTitle="Write" hasBackBtn>
      <form
        onSubmit={handleSubmit(onVaild)}
        className="w-full px-5 pb-20 flex flex-col"
      >        
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




import Head from "next/head";
import poddle from '/public/images/poddle.png'
import Image from "next/image";
import { useForm } from "react-hook-form";
import Input from "@/components/input";
import Button from "@/components/button";
import Link from "next/link";
import useMutation from "@/libs/client/useMutation";
import { useRouter } from "next/router";
import { useEffect } from "react";
import mutationTest from "@/libs/client/mutationTest";

interface CreateForm {
  email: string;
  password: string;
  name?: string;
}

interface CreateMutationResult{
  ok: boolean;
  errMsg: string;
}

export default function CreateAccount() {
  const [create, {loading, data, error }] = mutationTest<CreateMutationResult>({url: `/api/users/create-account`,method: "POST"})
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<CreateForm>({ mode: 'onSubmit' });
  const router = useRouter()
  const onValid = (form: CreateForm) => {  
    if(loading) return      
    create(form);
    reset();    
  }
  useEffect(()=>{
    if (data?.ok){
      router.push('/log-in')
    }
    if (!data?.ok && data?.errMsg) {
      setError(
        "email",
        { type: "custom", message: data?.errMsg },
        { shouldFocus: true }
      );
    }
  },[data, router, setError])
  return (
    <div>
      <Head>
        <title>회원가입</title>
      </Head>
      <div className="flex p-36 flex-col justify-center items-center h-full w-full m-auto">
        <div className="p-5 bg-amber-300/30 rounded-full"><Image src={poddle} priority={true} width='200' height='200' alt="" /></div>
        <div className="pt-8">
          <h1 className="font-['Pacifico'] text-black text-3xl select-none">
            Create Account
          </h1>
        </div>
        {/* 로그인 폼 */}
        <form
          onSubmit={handleSubmit(onValid)}
          className="w-full flex flex-col items-center space-y-4 pt-6 mb-4"
        >
          <Input
            type="email"
            placeholder="(필수) 이메일*"
            required={true}
            register={register("email",
              {
                required: '이메일을 입력해주세요',
                minLength: {
                  value: 5,
                  message: '이메일을 5글자 이상 입력해주세요.'
                },
                maxLength: {
                  value: 30,
                  message: '이메일을 30글자 이하로 입력해주세요.'
                },
              })}
            width="w-2/5"
          />

          <Input
            type="password"
            placeholder="(필수) 비밀번호* (4자리 이상)"
            required={true}
            minLength={4}
            maxLength={20}
            register={register("password", {
              required: '비밀번호를 입력해주세요',
              minLength: {
                value: 4,
                message: '비밀번호를 4글자 이상 입력해주세요.'
              },
              maxLength: {
                value: 20,
                message: '비밀번호를 20글자 이하로 입력해주세요.'
              }
            })}
            width="w-2/5"
          />
          <Input
            type="name"
            placeholder="(선택) 이름"
            required={false}
            maxLength={8}
            register={register("name", {
              maxLength: { value: 8, message: '이름을 8글자 이하로 입력해주세요' }
            })}
            width="w-2/5"
          />
          <Button text={isSubmitting ? "가입 중..." : "가입하기"} width="w-2/5" />
          <p className="text-red-400 text-center mt-4 text-lg font-semibold">{errors.email?.message?.toString()}</p>
          <p className="text-red-400 text-center mt-4 text-lg font-semibold">{errors.password?.message?.toString()}</p>
          <p className="text-red-400 text-center mt-4 text-lg font-semibold">{errors.name?.message?.toString()}</p>          
        </form>
        <div>
          <span className="mr-2 text-slate-700">이미 가입하셨다면?</span>      
          <Link href="/log-in" className="text-amber-600/90 font-bold">
            로그인
          </Link>
          
        </div>
      </div>
    </div>
  )
}

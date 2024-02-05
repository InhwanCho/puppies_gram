import Head from "next/head";
import poddle from '/public/images/poddle.png'
import { useForm } from "react-hook-form";
import Input from "@/components/input";
import Link from "next/link";
import Button from "@/components/button";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/router";
import useMutation from "@/libs/client/useMutation";

interface LoginForm {
  email: string;
  password: string;
}

interface LoginMutationResult {
  ok: boolean;
  errField?: string;
  errMsg?: string
}

export default function LogIn() {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<LoginForm>({ mode: 'onSubmit' });
  const [login, { loading, data }] = useMutation<LoginMutationResult>({ method: "POST" })
  const onValid = (form: LoginForm) => {
    if (loading) return;
    login('/api/users/log-in', form)
    reset();
  }
  const router = useRouter()
  useEffect(() => {
    if (data?.ok) {
      console.log('ok')
      router.push('/')
    }

    if (!data?.ok && data?.errField) {      
      if (data?.errField === "email") {
        setError('email', { type: 'custom', message: data?.errMsg }, { shouldFocus: true })
      } else if (data?.errField === "password") {
        setError('password', {
          type: 'custom', message: data?.errMsg
        }, { shouldFocus: true })
      }
    }
  }, [router, data, setError])
  return (
    <div>
      <Head>
        <title>로그인</title>
      </Head>
      <div className="flex p-36 flex-col justify-center items-center h-full w-full m-auto">
        <div className="p-5 bg-amber-300/30 rounded-full"><Image src={poddle} priority={true} width='200' height='200' alt="" /></div>
        <div className="pt-8">
          <h1 className="font-['Pacifico'] text-black text-3xl select-none">
            Log In
          </h1>
        </div>
        {/* 로그인 폼 */}
        <form
          onSubmit={handleSubmit(onValid)}
          className="w-full flex flex-col items-center space-y-4 pt-6 mb-4"
        >
          <Input
            type="email"
            placeholder="이메일"
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
                }
              })}
            width="w-2/5"
          />
          <Input
            type="password"
            placeholder="비밀번호"
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
          <Button text={isSubmitting ? "로그인 중" : "로그인"} width="w-2/5" />
          <p className="text-red-400 text-center mt-4 text-lg font-semibold">{errors.email?.message?.toString()}</p>
          <p className="text-red-400 text-center mt-4 text-lg font-semibold">{errors.password?.message?.toString()}</p>
        </form>
        <div>
          <span className="mr-2 text-slate-700">아이디가 없다면?</span>
          <Link href="/create-account" className="text-amber-600/90 font-bold">
            회원가입
          </Link>
        </div>
      </div>
    </div>
  )
}

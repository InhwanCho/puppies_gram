import Avatar from "@/components/avatar";
import Button from "@/components/button";
import Layout from "@/components/layout";
import useMutation from "@/libs/client/useMutation";
import useUser from "@/libs/client/useUser";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface EditForm {
  avatar?: string;
  name: string;
  password: string;
}

export default function Edit() {
  const router = useRouter()
  const { user } = useUser()

  const { register, handleSubmit, reset, formState: { errors }, } = useForm<EditForm>({
    defaultValues: {
      name: user?.name,
      password: user?.password,
    },
    mode: 'onChange'
  });
  const { register: avatarRegister, watch: avatarWatch } = useForm({
    mode: "onChange",
    defaultValues: { avatar: user?.avatar || "dog" },
  });
  const [edit, { loading, data }] = useMutation()
  const onValid = (form: EditForm) => {
    if (loading) return;
    form.avatar = avatarWatch('avatar');
    reset()
    edit("/api/users/edit", form)
    console.log('변경되었습니다 라고- 나중에 토스트로 알려주기 ')
  }
  useEffect(() => {
    if (data?.ok) {
      alert('프로필 변경 완료')
      router.push(`/`)
    }
  }, [data, router])
  return (
    <Layout pageTitle="Edit your profile" hasBackBtn>
      <div className="w-full p-5 pb-20 flex flex-col items-center">
        <Image        
        width={120}
        height={120}
        priority={true}
          alt="avatar"
          src={`/images/avatar/${avatarWatch("avatar")}.png`}
          className="mb-5 w-[180px] h-[180px] rounded-full object-contain border"
        />
        <div className="">
          <div className="flex flex-col items-center mb-6">
            <span className="font-semibold text-lg text-slate-900">{user?.email}</span>
            <p className="text-xs text-slate-600">가입일 {new Date(user?.createdAt!).toLocaleDateString("ko-KR")}</p>
          </div>

          <form className="mb-10 flex flex-wrap justify-center">
            {[
              "cat",
              "bee",
              "dog",
              "fox",
              "frog",
              "pig",
              "wolf",
              "mong",
            ].map((avatar, index) => (
              <Avatar
                key={index}
                avatar={avatar}
                index={index}
                avatarRegister={avatarRegister("avatar")}
              />
            ))}
          </form>
          {/* 유저 이름, 비밀번호 수정 */}
          <form onSubmit={handleSubmit(onValid)} className="w-full flex flex-col items-center space-y-8 mb-8">
            <label htmlFor="name" className="flex flex-col w-4/5 space-y-2">
              <span className="font-semibold text-sm">이름 (아이디)</span>
              <input {...register("name", {
                required: '이름을 입력해주세요',
                maxLength: {
                  value: 10,
                  message: '이름을 10글자 이하로 입력해주세요.'
                }
              })} type="text" id="name" maxLength={10} className="p-2 border bg-white rounded-lg focus:outline-none" />
            </label>
            <label htmlFor="password" className="flex flex-col w-4/5 space-y-2">
              <span className="font-semibold text-sm">비밀번호</span>
              <input {...register("password", {
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
                type="password" id="password" maxLength={20} className="p-2 border bg-white rounded-lg focus:outline-none" />
            </label>

            <Button text={false ? "저장 중..." : "변경하기"}
              isGradient
              isRounded
              width="w-4/5" />
            <p className="text-red-400 text-center mt-4 text-xl font-semibold">{errors.name?.message?.toString()}</p>
            <p className="text-red-400 text-center mt-4 text-xl font-semibold">{errors.password?.message?.toString()}</p>
          </form>
        </div>
      </div>
    </Layout>
  )
}

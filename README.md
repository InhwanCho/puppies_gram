# PuppiesGram

Instagram을 참고하여 코딩하였습니다.

배포 주소 : [PuppiesGram](https://puppies-gram.vercel.app/ 'PuppiesGram')

## 실행

1. `.env 파일` 설정

```file:.env
COOKIE_PASSWORD:"비밀번호 설정 최소 30자"

# CloudFlare(이미지 업로드) 사용 시 등록
CF_ID:
CF_TOKEN:
```

2. 패키지 설치

```bash
npm install
npx prisma db push
npm run dev
```

3. 회원가입 및 로그인

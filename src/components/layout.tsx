import { useRouter } from "next/router";
import Head from "next/head";
import React from "react";

import { cls } from "@/libs/client/utils";
import NavBar from "@/components/navbar";

interface LayoutProps {
  hasTitleLogo?: boolean;
  pageTitle?: string;
  hasBackBtn?: boolean;
  children: React.ReactNode;
}

const Layout = ({
  hasTitleLogo,
  pageTitle,
  hasBackBtn,
  children,
}: LayoutProps) => {
  {
    /* 뒤로가기 */
  }
  const router = useRouter();
  const onBackBtnClick = () => {
    router.back();
  };

  return (
    <div className='relative max-w-xl mx-auto min-h-screen bg-white shadow-2xl'>
      <Head>
        <title>{pageTitle ? `${pageTitle}ㆍPuppiesGram` : "PuppiesGram"}</title>
      </Head>
      {/* 상단 헤더 */}
      <header
        className={cls(
          "fixed top-0 z-10 max-w-xl w-full px-8 py-6 flex items-center bg-amber-100/70",
          hasTitleLogo ? "border-b border-slate-600/60" : ""
        )}
      >
        {/* 뒤로가기 버튼 */}
        {hasBackBtn ? (
          <button onClick={onBackBtnClick} className="absolute left-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#9CA3AF"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
              />
            </svg>
          </button>
        ) : null}

        {/* 타이틀 로고 */}
        {hasTitleLogo ? (
          <h1 className="font-['Pacifico'] text-slate-900 text-2xl select-none">
            PuppiesGram
          </h1>
        ) : null}

        {/* 페이지 제목 */}
        {pageTitle ? (
          <h1 className="w-full text-center font-['Pacifico'] text-slate-900 text-2xl select-none">
            {pageTitle}
          </h1>
        ) : null}
      </header>
      {/* 메인 영역 */}
      <main className="bg-white py-20">{children}</main>

      {/* 하단바 */}
      <NavBar />
    </div>
  );
};

export default Layout;

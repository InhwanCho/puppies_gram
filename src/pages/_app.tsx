import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SkeletonTheme } from "react-loading-skeleton";
import { SWRConfig } from "swr";


export default function App({ Component, pageProps }: AppProps) {
  return (
    <SkeletonTheme baseColor="#EAF1F4" highlightColor="#F4F4F4">
      <SWRConfig
        value={{
          fetcher: (url: string) => fetch(url).then((response) => response.json()),
          refreshInterval: 1000
        }}
      >
        <Component {...pageProps} />
      </SWRConfig>
    </SkeletonTheme>
  )
}

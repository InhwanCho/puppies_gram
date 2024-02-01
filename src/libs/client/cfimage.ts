interface CfImageProps {
  imageUrl: string;
  type: "public" | "avatar";
}

export default function cfimage({ imageUrl, type }: CfImageProps): string {
  const url = `https://imagedelivery.net/ON9qRIyx3zTyDVGw8arVfg/${imageUrl}/${type}`;

  return url;
}

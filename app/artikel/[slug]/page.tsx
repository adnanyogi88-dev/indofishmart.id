import { permanentRedirect } from "next/navigation";

type ArticleRedirectProps = {
  params: Promise<{ slug: string }>;
};

export default async function ArticleRedirect({ params }: ArticleRedirectProps) {
  const { slug } = await params;
  permanentRedirect(`/${slug}/`);
}

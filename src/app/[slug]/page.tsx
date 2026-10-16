import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import PubView, { DrinksSkeleton, HeadingSkeleton } from "@/components/PubView";
import ThemeToggle from "@/components/ThemeToggle";
import { getApiConfig } from "@/lib/jdw/config";

// Venue data is loaded in the browser, so the title comes from the slug
function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .filter((word) => !/^\d+$/.test(word))
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const name = titleFromSlug(slug);
  return {
    title: name,
    description: `The best value drinks at ${name}, ranked by price per unit of alcohol.`,
  };
}

function TopBar() {
  return (
    <div className="flex items-center justify-between px-2 pt-[max(0.5rem,env(safe-area-inset-top))] text-white">
      <Link
        href="/"
        aria-label="Back to pub search"
        className="grid size-10 place-items-center rounded-full transition hover:bg-white/15 active:scale-90"
      >
        <ChevronLeft className="size-6" />
      </Link>
      <Link href="/" aria-label="wetherspenny home" className="logo-white">
        <Logo className="h-5 w-auto" />
      </Link>
      <ThemeToggle className="hover:bg-white/15" />
    </div>
  );
}

async function Pub({ params }: Pick<PageProps<"/[slug]">, "params">) {
  const [{ slug }, config] = await Promise.all([params, getApiConfig()]);
  return <PubView slug={slug} config={config} />;
}

export default function PubPage({ params }: PageProps<"/[slug]">) {
  return (
    <>
      <div className="backdrop" aria-hidden />
      <main className="mx-auto w-full max-w-xl flex-1">
        <TopBar />
        <Suspense
          fallback={
            <>
              <HeadingSkeleton />
              <DrinksSkeleton />
            </>
          }
        >
          <Pub params={params} />
        </Suspense>
      </main>
      <Footer className="mx-auto mt-4 w-full max-w-xl rounded-t-3xl bg-bg" />
    </>
  );
}

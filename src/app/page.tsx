import { Suspense } from "react";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import PubFinder from "@/components/PubFinder";
import ThemeToggle from "@/components/ThemeToggle";
import { getApiConfig } from "@/lib/jdw/config";

async function Finder() {
  return <PubFinder config={await getApiConfig()} />;
}

export default function Home() {
  return (
    <>
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="flex justify-end">
          <ThemeToggle className="text-muted hover:bg-surface-2" />
        </div>

        <section className="mt-[10vh] animate-rise text-center">
          <h1>
            <Logo className="mx-auto w-full max-w-85" />
          </h1>
          <p className="mx-auto mt-5 max-w-xs text-balance text-muted">
            Every drink at every Spoons, ranked by how much alcohol you get for
            your money.
          </p>
        </section>

        <section className="mt-10 animate-rise [animation-delay:80ms]">
          <Suspense
            fallback={
              <div className="h-31 animate-pulse rounded-2xl bg-surface-2" />
            }
          >
            <Finder />
          </Suspense>
        </section>
      </main>
      <Footer />
    </>
  );
}

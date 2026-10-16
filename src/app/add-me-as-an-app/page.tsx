import { ChevronLeft, EllipsisVertical, Share, SquarePlus } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import step1 from "../../../public/static/steps/step1.png";
import step2 from "../../../public/static/steps/step2.png";
import step3 from "../../../public/static/steps/step3.png";
import step4 from "../../../public/static/steps/step4.png";

export const metadata: Metadata = {
  title: "Add me as an app",
  description:
    "Add wetherspenny to your home screen so it's always a tap away.",
};

const IOS_STEPS = [
  { image: step1, label: "Tap the share button in Safari" },
  { image: step2, label: "Choose Add to Home Screen" },
  { image: step3, label: "Tap Add" },
  { image: step4, label: "Admire!" },
];

export default function AddMeAsAnApp() {
  return (
    <>
      <div className="backdrop" aria-hidden />
      <main className="mx-auto w-full max-w-xl flex-1 text-white">
        <div className="flex items-center justify-between px-2 pt-[max(0.5rem,env(safe-area-inset-top))]">
          <Link
            href="/"
            aria-label="Back home"
            className="grid size-10 place-items-center rounded-full transition hover:bg-white/15 active:scale-90"
          >
            <ChevronLeft className="size-6" />
          </Link>
          <Link href="/" aria-label="wetherspenny home" className="logo-white">
            <Logo className="h-5 w-auto" />
          </Link>
          <ThemeToggle className="hover:bg-white/15" />
        </div>

        <header className="animate-rise px-4 pt-6 pb-2">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Add me as an app
          </h1>
          <p className="mt-2 text-white/80">
            Put wetherspenny on your home screen so the cheapest round is always
            one tap away.
          </p>
        </header>

        <section className="mt-6">
          <h2 className="px-4 text-sm font-semibold tracking-wider text-white/80 uppercase">
            iPhone
          </h2>
          <ol className="mt-3 flex snap-x snap-mandatory scroll-px-4 [scrollbar-width:none] gap-3 overflow-x-auto px-4 pb-2">
            {IOS_STEPS.map(({ image, label }, index) => (
              <li
                key={label}
                className="w-[72%] max-w-64 shrink-0 animate-rise snap-start rounded-3xl bg-surface p-3 text-text shadow-lg shadow-black/10"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <p className="px-1 pb-3 text-sm font-semibold">
                  <span className="text-blue">Step {index + 1}</span> · {label}
                </p>
                <Image
                  src={image}
                  alt={`Step ${index + 1}: ${label}`}
                  sizes="256px"
                  className="w-full rounded-2xl"
                  placeholder="blur"
                />
              </li>
            ))}
          </ol>
          <p className="mt-2 flex items-center gap-1.5 px-4 text-sm text-white/80">
            In Safari: <Share className="size-4" /> then
            <SquarePlus className="size-4" /> Add to Home Screen
          </p>
        </section>

        <section className="mx-4 mt-8 rounded-3xl bg-surface p-5 text-text shadow-lg shadow-black/10">
          <h2 className="text-sm font-semibold tracking-wider text-muted uppercase">
            Android
          </h2>
          <ol className="mt-3 list-inside list-decimal space-y-2">
            <li>
              Open wetherspenny in Chrome and tap the{" "}
              <EllipsisVertical className="inline size-4 align-text-bottom" />{" "}
              menu
            </li>
            <li>
              Tap <strong>Add to Home screen</strong> or{" "}
              <strong>Install app</strong>
            </li>
            <li>Tap Install</li>
          </ol>
        </section>
      </main>
      <Footer className="mx-auto mt-8 w-full max-w-xl rounded-t-3xl bg-bg" />
    </>
  );
}

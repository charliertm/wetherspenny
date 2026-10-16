import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Privacy & terms",
  description: "How wetherspenny handles your data, and the terms of use.",
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="mt-2 space-y-3 leading-relaxed text-muted [&_a]:font-medium [&_a]:text-blue [&_a]:underline-offset-2 hover:[&_a]:underline [&_strong]:text-text [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}

export default function Privacy() {
  return (
    <>
      <main className="mx-auto w-full max-w-xl flex-1 px-4 pt-[max(0.5rem,env(safe-area-inset-top))]">
        <div className="-mx-2 flex items-center justify-between">
          <Link
            href="/"
            aria-label="Back home"
            className="grid size-10 place-items-center rounded-full text-muted transition hover:bg-surface-2 active:scale-90"
          >
            <ChevronLeft className="size-6" />
          </Link>
          <Link href="/" aria-label="wetherspenny home">
            <Logo className="h-5 w-auto" />
          </Link>
          <ThemeToggle className="text-muted hover:bg-surface-2" />
        </div>

        <article className="animate-rise pt-6 pb-4">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Privacy &amp; terms
          </h1>
          <p className="mt-2 text-sm text-muted">
            Last updated 16 October 2026
          </p>

          <Section title="The short version">
            <p>
              wetherspenny has no accounts, no cookies, no analytics, no ads and
              no tracking. Nothing about you is sent to us.
            </p>
          </Section>

          <Section title="What's stored on your device">
            <p>
              To make the site faster and remember your settings, your browser
              keeps a few things in its local storage:
            </p>
            <ul>
              <li>Your light or dark mode choice</li>
              <li>The list of pubs, for up to a day</li>
              <li>
                The drink prices for pubs you&apos;ve viewed, for up to an hour
              </li>
            </ul>
            <p>
              None of this leaves your device and you can clear it at any time
              in your browser&apos;s settings.
            </p>
          </Section>

          <Section title="Your location">
            <p>
              If you tap <strong>Find my nearest Spoons</strong>, your browser
              asks permission to share your location. It&apos;s only used on
              your device to work out which pubs are closest and is never sent
              anywhere.
            </p>
          </Section>

          <Section title="Other services">
            <ul>
              <li>
                Pub and drink information is loaded by your browser straight
                from the API behind the Wetherspoon app. Like any website, it
                will see a normal web request from your device, including your
                IP address. See the{" "}
                <a href="https://www.jdwetherspoon.com">J D Wetherspoon</a>{" "}
                website for how they handle data.
              </li>
              <li>
                The site is hosted by{" "}
                <a href="https://vercel.com/legal/privacy-policy">Vercel</a>,
                which keeps standard server logs to run and protect it.
              </li>
            </ul>
          </Section>

          <Section title="Terms of use">
            <ul>
              <li>
                wetherspenny is an unofficial, independent project. It
                isn&apos;t affiliated with or endorsed by J D Wetherspoon plc,
                and Wetherspoon names belong to their owners.
              </li>
              <li>
                Prices, deals and ABVs come from the Wetherspoon app and can be
                wrong, missing or out of date. Units are estimates worked out
                from ABV and serving size. Always check at the bar.
              </li>
              <li>
                It&apos;s for adults of legal drinking age. Finding good value
                isn&apos;t a reason to drink more: the UK guidelines advise not
                regularly drinking more than 14 units a week. For advice and
                support, visit{" "}
                <a href="https://www.drinkaware.co.uk">Drinkaware</a>.
              </li>
              <li>
                The site is provided as is, without any warranty. The code is
                open source under the MIT licence.
              </li>
            </ul>
          </Section>

          <Section title="Contact">
            <p>
              Questions or problems? Open an issue on{" "}
              <a href="https://github.com/charliertm/wetherspenny/issues">
                GitHub
              </a>
              .
            </p>
          </Section>
        </article>
      </main>
      <Footer />
    </>
  );
}

import SetFootnotes from "@/components/footer/breadcrumb/SetFootnotes";
import { HeroText } from "@/components/HeroText";

export default function Home() {
  return (
    <main>
      <section className=" px-4 pt-12 text-center">
        <HeroText />

        <p className="mx-auto mt-6 max-w-2xl text-md text-foreground/70">
          Science is producing real breakthroughs. Ordinary people are being
          priced out of them. At Bohemia Health, machine learning and AI
          research is used to curate a new frontier of modern healthcare.
          <br></br>
          <br></br>
          Explore a new unique era of biotechnology - one where breakthroughs
          only matter when it reaches someone.
        </p>

        <div
          className="mx-auto mt-16 aspect-[1244/800] max-w-8xl
                mask-[url(/cut-out-component.svg)] mask-size-[100%_100%] mask-no-repeat"
        >
          <img
            src="/shrinath-Kc_BxOB_a3c-unsplash.jpg"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      <SetFootnotes
        notes={[
          "The information provided on this site is for general informational and educational purposes. Certain sections of this Web site are intended for particular audiences including Bohemia's employees, as well as members of the health care community and the general public. Your access to and use of the information contained in the Web site is subject to this Terms of Use Agreement. By accessing and using this Web site you accept, without limitation or qualification, this Terms of Use Agreement.",
          "Bohemia will use reasonable efforts to include accurate and up-to-date information on this Web site but makes no warranties or representations of any kind as to its accuracy, currency or completeness. You agree that access to and use fo this Web site and the content thereof is at your own risk.",
        ]}
      />
    </main>
  );
}

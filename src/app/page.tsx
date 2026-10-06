export default function Home() {
  return (
    <main>
      <section className=" px-4 pt-12 text-center">
        <h1 className="text-5xl font-semibold tracking-tight text-foreground md:text-8xl">
          Cut out the middleman
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-md text-foreground/60">
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
    </main>
  );
}

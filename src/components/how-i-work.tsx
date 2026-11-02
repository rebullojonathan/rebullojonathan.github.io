const steps = [
  {
    title: "Discovery call",
    desc: "We map your current process, your tools and the bottleneck worth automating first.",
  },
  {
    title: "Build & test",
    desc: "I build the system in your tools and test it end to end with real scenarios before it goes live.",
  },
  {
    title: "Handover & support",
    desc: "You get documentation, a walkthrough for your team and support while you adopt it.",
  },
];

export function HowIWork() {
  return (
    <section id="process" className="lw-section lw-section-tight" aria-labelledby="process-title">
      <div className="lw-container">
        <p className="lw-eyebrow" data-reveal>
          <span className="lw-mono-index">04</span> How I work
        </p>
        <h2 id="process-title" className="lw-h2" data-reveal>
          From first call to a working system
        </h2>
        <ol className="lw-process">
          {steps.map((step, index) => (
            <li key={step.title} data-reveal>
              <span className="lw-process-num" aria-hidden="true">
                0{index + 1}
              </span>
              <h3 className="lw-h4">{step.title}</h3>
              <p>{step.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

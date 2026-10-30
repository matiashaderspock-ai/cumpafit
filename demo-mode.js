// Runs before app.js and before any database is opened. The query flag is never
// persisted: opening the normal app always selects its original database.
Object.defineProperty(window, "CUMPAFIT_DEMO", {
  value: new URLSearchParams(window.location.search).get("demo") === "1",
  writable: false,
});

if (window.CUMPAFIT_DEMO) {
  document.documentElement.classList.add("demo-mode");
  document.title = "DEMO · Cumpafit · Rutinas";
  document.querySelector('meta[name="apple-mobile-web-app-title"]').content = "DEMO · Cumpafit";
  // Avoid an install from the demo launching the normal app's start_url.
  document.querySelector('link[rel="manifest"]').remove();
  const policy = document.createElement("meta");
  policy.httpEquiv = "Content-Security-Policy";
  policy.content = "connect-src 'none'; form-action 'none'";
  document.head.append(policy);
  document.addEventListener("DOMContentLoaded", () => {
    const banner = document.querySelector("#demo-banner");
    const measure = () => document.documentElement.style.setProperty("--demo-banner-height", `${banner.getBoundingClientRect().height}px`);
    measure();
    new ResizeObserver(measure).observe(banner);
    document.querySelector("#import-file").remove();
  });
}

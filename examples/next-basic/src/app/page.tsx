import { Button, Code, Card } from "@perfectest/react";
import { getEnv, isDevelopment } from "@perfectest/server";

export default function Home() {
  const appName = getEnv("APP_NAME", "Next Basic");
  const mode = isDevelopment() ? "development" : "production";

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="mb-2 text-3xl font-semibold">{appName}</h1>
      <p className="mb-8 text-neutral-500">
        Running in <Code className="text-sm">{mode}</Code> mode
      </p>

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-medium">Button</h2>
        <div className="flex gap-3">
          <Button
            appName={appName}
            className="rounded bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-700"
          >
            Click me
          </Button>
          <Button
            appName={appName}
            className="rounded border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-100"
          >
            Secondary
          </Button>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-medium">Cards</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Card
            title="Documentation"
            href="https://github.com/perfectbase/monorepo-package-template"
            className="block rounded border border-neutral-200 p-4 hover:border-neutral-400"
          >
            View the source and docs.
          </Card>
          <Card
            title="Examples"
            href="https://github.com/perfectbase/monorepo-package-template/tree/main/examples"
            className="block rounded border border-neutral-200 p-4 hover:border-neutral-400"
          >
            More example apps.
          </Card>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-medium">Environment</h2>
        <div className="rounded border border-neutral-200 p-4 font-mono text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-500">APP_NAME</span>
            <span>{appName}</span>
          </div>
          <div className="mt-2 flex justify-between">
            <span className="text-neutral-500">NODE_ENV</span>
            <span>{mode}</span>
          </div>
        </div>
      </section>
    </main>
  );
}

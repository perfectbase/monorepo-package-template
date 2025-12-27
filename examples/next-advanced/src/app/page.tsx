import { Button, Code, Card, cn } from "@perfectest/react";
import { getEnv, isDevelopment, isProduction } from "@perfectest/server";

export default function Home() {
  const appName = getEnv("APP_NAME", "Next Advanced");
  const version = getEnv("APP_VERSION", "1.0.0");
  const isDev = isDevelopment();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-12">
        <div className="mb-3 flex items-center gap-2">
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              isDev ? "bg-yellow-500" : "bg-green-500"
            )}
          />
          <span className="text-sm text-neutral-500">
            {isDev ? "Development" : "Production"}
          </span>
        </div>
        <h1 className="mb-2 text-4xl font-semibold">{appName}</h1>
        <p className="text-neutral-500">
          Using <Code className="text-sm">@perfectest/react</Code> and{" "}
          <Code className="text-sm">@perfectest/server</Code>
        </p>
      </header>

      <section className="mb-12">
        <h2 className="mb-4 text-lg font-medium">Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <Button
            appName={appName}
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-700"
          >
            Primary
          </Button>
          <Button
            appName={appName}
            className="rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-100"
          >
            Secondary
          </Button>
          <Button
            appName={appName}
            className="rounded-md px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-100"
          >
            Ghost
          </Button>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-lg font-medium">Features</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { icon: "⚛️", title: "React Components", desc: "Button, Card, Code" },
            { icon: "🖥️", title: "Server Utils", desc: "getEnv, isDevelopment" },
            { icon: "🔗", title: "Shared Utils", desc: "cn() for class names" },
            { icon: "📦", title: "Monorepo Ready", desc: "Workspace packages" },
          ].map((f) => (
            <div key={f.title} className="rounded border border-neutral-200 p-4">
              <span className="mb-2 block text-xl">{f.icon}</span>
              <h3 className="font-medium">{f.title}</h3>
              <p className="text-sm text-neutral-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-lg font-medium">Links</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Card
            title="GitHub"
            href="https://github.com/perfectbase/monorepo-package-template"
            className="block rounded border border-neutral-200 p-4 hover:border-neutral-400"
          >
            Source code and documentation.
          </Card>
          <Card
            title="npm"
            href="https://www.npmjs.com/org/perfectest"
            className="block rounded border border-neutral-200 p-4 hover:border-neutral-400"
          >
            Published packages.
          </Card>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-medium">Environment</h2>
        <div className="rounded border border-neutral-200 p-4 font-mono text-sm">
          <div className="grid gap-2">
            <div className="flex justify-between">
              <span className="text-neutral-500">APP_NAME</span>
              <span>{appName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">APP_VERSION</span>
              <span>{version}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">isDevelopment()</span>
              <span>{String(isDev)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">isProduction()</span>
              <span>{String(isProduction())}</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

import { LoginForm } from "@/components/login-form";
import { CheckCircle2, Package, Tag } from "lucide-react";

const FEATURES = [
  { icon: Package, text: "تصفح المنتجات واطلب احتياجات صيدليتك بسهولة" },
  { icon: Tag, text: "اكتشف أحدث العروض والخصومات من الموردين" },
  { icon: CheckCircle2, text: "تابع طلباتك وراجع سجل مشترياتك بكل سهولة" },
];

const OVERLAP = "4rem";

export default function Page() {
  return (
    <main className="flex min-h-screen w-full flex-col lg:flex-row">
      <section
        className="relative z-10 hidden flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground lg:flex lg:w-1/2 lg:shadow-[24px_0_50px_-24px_rgba(0,0,0,0.35)] "
        style={{
          marginLeft: `calc(${OVERLAP} * -1)`,
          paddingLeft: `calc(6rem + ${OVERLAP})`,
          clipPath: `polygon(${OVERLAP} 0, 100% 0, 100% 100%, 0 100%)`,
        }}
      >
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.2]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="dots"
              width="28"
              height="28"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1.5" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>

        <div className="flex w-60  items-center gap-2  rounded-xl py-2 pr-4 bg-primary-foreground/8">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary-foreground/15">
            <Package className="size-5" aria-hidden="true" />
          </div>

          <span className="font-heading  font-semibold">
        Med Market Platform 
          </span>
        </div>

        <div className="max-w-md">
          <h2 className="font-heading text-balance">
            <span className="block text-2xl font-medium ">
              كل احتياجات صيدليتك
            </span>

            <span className="mt-1 block text-4xl font-bold leading-tight tracking-tight">
              في مكان واحد.
            </span>
          </h2>

          <p className="mt-5 text-lg leading-relaxed text-pretty text-primary-foreground/80">
            اطلب منتجاتك من موردين موثوقين، اكتشف أفضل العروض، وتابع 
             مشترياتك بسهولة .
          </p>

          <ol className="relative mt-10 flex flex-col gap-6">
            <span
              className="absolute right-4 top-4 bottom-4 w-px bg-primary-foreground/20"
              aria-hidden="true"
            />

            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="relative flex items-center gap-4">
                <span className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-foreground text-primary">
                  <Icon className="size-4" aria-hidden="true" />
                </span>

                <span className="text-primary-foreground/90">{text}</span>
              </li>
            ))}
          </ol>
        </div>

        <p className="text-sm text-primary-foreground/60">
          {`© ${new Date().getFullYear()} منصة الإمداد الدوائي. جميع الحقوق محفوظة.`}
        </p>
      </section>

      <section
        className="relative flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-8"
      >
        <div className="mb-8 flex items-center gap-2 lg:hidden">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary">
            <Package
              className="size-5 text-primary-foreground"
              aria-hidden="true"
            />
          </div>

          <span className="font-heading text-lg font-semibold text-foreground">
            منصة الإمداد الدوائي
          </span>
        </div>

        <LoginForm />
      </section>
    </main>
  );
}
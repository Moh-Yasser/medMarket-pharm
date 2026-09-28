"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/lib/api/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import {  Eye, EyeOff, Loader2, Pill } from "lucide-react";


export function LoginForm() {

  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginAction, null);

  useEffect(() => {
    if (state?.success) {
      if (state.user.role === "buyer") {
        router.push("/products");
      } else {
        router.push("/login");
      }
    }
  }, [state, router]);

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground text-balance">
          تسجيل الدخول
        </h1>
        <p className="mt-2 text-base leading-relaxed text-muted-foreground text-pretty">
          الرجاء إدخل بريدك الإلكتروني وكلمة المرور
        </p>
      </div>
      <div className="flex items-center justify-center gap-2 mb-6 rounded-lg py-2.5 text-sm font-medium  bg-card text-primary shadow-sm">
        <Pill className="size-4" aria-hidden="true" />
        صيدليتك
      </div>
      <form action={formAction} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input
            id="email"
            name="email"
            type="email"
            dir="ltr"
            placeholder="you@pharmacy.com"
            defaultValue="khaled@citypharmacy.com"
            className="text-start"
            required
            disabled={isPending}
            aria-invalid={state?.success === false}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">كلمة المرور</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="أدخل كلمة المرور"
              defaultValue="password123"
              required
              className="pe-10"
              disabled={isPending}
              aria-invalid={state?.success === false}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={
                showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
              }
              className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <Eye className="size-4" aria-hidden="true" />
              ) : (
                <EyeOff className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              جارٍ تسجيل الدخول...
            </>
          ) :
            "تسجيل الدخول "
          }
        </Button>
      </form>
    </div>
  );
}

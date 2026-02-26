"use client"

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { loginAction } from "@/lib/api/auth"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(loginAction, null)

  useEffect(() => {
    if (state?.success) {
      if (state.user.role === "buyer") {
        router.push("/products")
      } else  {
        router.push("/dashboard")
      } 
    }
  }, [state, router])

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>تسجيل الدخول إلى حسابك</CardTitle>
          <CardDescription>
            أدخل بريدك الإلكتروني أدناه لتسجيل الدخول إلى حسابك
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">البريد الإلكتروني</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  defaultValue="khaled@citypharmacy.com"
                  disabled={isPending}
                  aria-invalid={state?.success === false}
                />
                {state?.success === false && state.error && (
                  <FieldError>{state.error}</FieldError>
                )}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">كلمة المرور</FieldLabel>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  defaultValue="password123"
                  disabled={isPending}
                  aria-invalid={state?.success === false}
                />
              </Field>
              <Field>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

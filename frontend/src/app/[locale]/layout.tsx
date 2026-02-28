import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import ToastContainer from "@/components/ui/Toast";
import AuthProvider from "@/components/AuthProvider";
import ThemeProvider from "@/components/ThemeProvider";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <ThemeProvider>
              <div className="flex min-h-screen flex-col">
                <main className="flex-1">{children}</main>
              </div>
              <ToastContainer />
            </ThemeProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

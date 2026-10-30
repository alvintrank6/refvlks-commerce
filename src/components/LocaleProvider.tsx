"use client";

import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import en from "../messages/en.json";
import vi from "../messages/vi.json";

export function LocaleProvider({
  children,
  locale,
}: {
  children: ReactNode;
  locale: "en" | "vi";
}) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={locale === "vi" ? vi : en}
    >
      {children}
    </NextIntlClientProvider>
  );
}

import { ScrollViewStyleReset } from "expo-router/html";
import React from "react";

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        <ScrollViewStyleReset />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              * { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
              input, textarea, select { font-size: 16px !important; }
              body { overflow: hidden; }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

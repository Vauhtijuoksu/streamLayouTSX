import "./globals.css";
import {ReactNode} from "react";
import {ApiWrapper} from "@/DataHandler/ApiWrapper";
import {DataProvider} from "@/DataHandler/DataProvider";
import {SlotProvider} from "@/DataHandler/SlotProvider";
import {TextSizeProvider} from "@/util/TextSize";


export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main>
          <TextSizeProvider>
            <DataProvider>
              <ApiWrapper>
                <SlotProvider>
                  {children}
                </SlotProvider>
              </ApiWrapper>
            </DataProvider>
          </TextSizeProvider>
        </main>
      </body>
    </html>
  );
}

import {TextSizeProvider} from "@/util/TextSize";
import {DataProvider} from "@/DataHandler/DataProvider";
import {ApiWrapper} from "@/DataHandler/ApiWrapper";
import {SlotProvider} from "@/DataHandler/SlotProvider";
import {ReactNode} from "react";



export default function Providers({
  children,
  poll = true
}: Readonly<{
  children: ReactNode;
  poll?: boolean
}>) {
  return (
    <TextSizeProvider>
      <DataProvider>
        <ApiWrapper poll={poll}>
          <SlotProvider>
            {children}
          </SlotProvider>
        </ApiWrapper>
      </DataProvider>
    </TextSizeProvider>
  );
}
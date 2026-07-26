import { Suspense } from "react";
import RentClient from "./RentClient";

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center">
          Loading...
        </main>
      }
    >
      <RentClient />
    </Suspense>
  );
}
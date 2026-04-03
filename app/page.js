// app/page.jsx
import { Suspense } from "react";
import HomeContent from "./HomeContent/HomeConten";

export default function Page() {
  return (
    <Suspense fallback={<main className="bg-black min-h-screen" />}>
      <HomeContent />
    </Suspense>
  );
}

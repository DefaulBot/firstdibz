"use client";

import { Suspense } from "react";
import { SignInContent } from "./SignInContent";

function SignInSkeleton() {
  return (
    <div className="mx-auto max-w-5xl rounded-[2rem] border border-[#8C9FAE]/30 bg-white p-8 shadow-soft">
      <div className="h-64 bg-[#D9EBDD]/30 rounded-lg animate-pulse" />
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<SignInSkeleton />}>
      <SignInContent />
    </Suspense>
  );
}

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "react-error-boundary";

import TestStatic from "../components/test-static";

const TestSource = dynamic(() => import("../components/test-source"), {
  suspense: true,
});

const TestPublic = dynamic(
  // @ts-ignore
  () => import(/* webpackIgnore: true */ "/test-public.js"),
  {
    ssr: false,
    suspense: true,
  }
);

const TestApiRollup = dynamic(
  // @ts-ignore
  // () => import(/* webpackIgnore: true */ "/api/test-api-rollup?no-cache"),
  () => import(/* webpackIgnore: true */ "/api/test-api-rollup"),
  {
    ssr: false,
    suspense: true,
  }
);

const TestApiSwc = dynamic(
  // @ts-ignore
  // () => import(/* webpackIgnore: true */ "/api/test-api-swc?no-cache"),
  () => import(/* webpackIgnore: true */ "/api/test-api-swc"),
  {
    ssr: false,
    suspense: true,
  }
);

const createErrorFallback = (
  message: string = "Something went wrong for this component:"
) => {
  const ErrorFallback = ({ error }: { error: { message: string } }) => {
    return (
      <div role="alert">
        <p>{message}</p>
        <pre>{error.message}</pre>
      </div>
    );
  };
  return ErrorFallback;
};

const Index = () => {
  return (
    <div className="p-12 space-y-12">
      <div>
        <div className="prose prose-indigo prose-lg text-gray-500 lg:max-w-none">
          <h1 className="text-3xl text-gray-900 font-extrabold tracking-tight sm:text-4xl">
            Reflective-Next
          </h1>
          <p>
            Demonstrating various ways of importing dynamically-generated React
            components in NextJS. (The last one is the best!)
          </p>
          <p>
            See{" "}
            <a href="https://github.com/crubier/reflective-next">
              https://github.com/crubier/reflective-next
            </a>
          </p>
        </div>
      </div>

      <ul className="space-y-12">
        <li>
          <ErrorBoundary
            FallbackComponent={createErrorFallback(
              "Something went wrong when loading the component loaded with a normal import:"
            )}
          >
            <TestStatic />
          </ErrorBoundary>
        </li>

        <li>
          <ErrorBoundary
            FallbackComponent={createErrorFallback(
              "Something went wrong when loading the component loaded with a NextJS dynamic import:"
            )}
          >
            <Suspense fallback={<div>Loading...</div>}>
              <TestSource />
            </Suspense>
          </ErrorBoundary>
        </li>

        <li>
          <ErrorBoundary
            FallbackComponent={createErrorFallback(
              "Something went wrong when loading the component loaded from a static file:"
            )}
          >
            <Suspense fallback={<div>Loading...</div>}>
              <TestPublic />
            </Suspense>
          </ErrorBoundary>
        </li>

        <li>
          <ErrorBoundary
            FallbackComponent={createErrorFallback(
              "Something went wrong when loading the component transpiled dynamically with Rollup on the server:"
            )}
          >
            <Suspense fallback={<div>Loading...</div>}>
              <TestApiRollup />
            </Suspense>
          </ErrorBoundary>
        </li>

        <li>
          <ErrorBoundary
            FallbackComponent={createErrorFallback(
              "Something went wrong when loading the component transpiled dynamically with SWC on the server:"
            )}
          >
            <Suspense fallback={<div>Loading...</div>}>
              <TestApiSwc />
            </Suspense>
          </ErrorBoundary>
        </li>
      </ul>
    </div>
  );
};
export default Index;

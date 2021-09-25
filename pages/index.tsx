import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "react-error-boundary";
import {
  CalendarIcon,
  ChartBarIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  UsersIcon,
} from "@heroicons/react/outline";

import { Layout } from "../components/layout";
import TestStatic from "../components/test-static";

const navigation = [
  { name: "Dashboard", href: "#", icon: HomeIcon, current: true },
  { name: "Team", href: "#", icon: UsersIcon, current: false },
  { name: "Projects", href: "#", icon: FolderIcon, current: false },
  { name: "Calendar", href: "#", icon: CalendarIcon, current: false },
  { name: "Documents", href: "#", icon: InboxIcon, current: false },
  { name: "Reports", href: "#", icon: ChartBarIcon, current: false },
];
const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];

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

const TestApiSwc = dynamic(
  // @ts-ignore
  // () => import(/* webpackIgnore: true */ "/api/test-api-swc?no-cache"),
  () => import(/* webpackIgnore: true */ "/api/test-api-swc"),
  {
    ssr: false,
    suspense: true,
  }
);

const TestApiRollup = dynamic(
  // @ts-ignore
  // () => import(/* webpackIgnore: true */ "/api/test-api-rollup?no-cache"),
  () => import(/* webpackIgnore: true */ "/api/test-api-rollup?no-cache"),
  {
    ssr: false,
    suspense: true,
  }
);

const Index = () => {
  return (
    <Layout
      title="Loading 4 react components in increasingly dynamic ways with NextJS, ReactSuspense and SWC"
      navigation={navigation}
      userNavigation={userNavigation}
    >
      <div className="py-4">
        <ul className="space-y-6">
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
                "Something went wrong when loading the component transpiled dynamically with SWC on the server. It is expected to fail on Vercel, but works locally:"
              )}
            >
              <Suspense fallback={<div>Loading...</div>}>
                <TestApiSwc />
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
        </ul>
      </div>
    </Layout>
  );
};
export default Index;

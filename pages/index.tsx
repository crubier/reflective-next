import React, { Suspense } from "react";
import dynamic from "next/dynamic";

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

const TestApi = dynamic(
  // @ts-ignore
  // () => import(/* webpackIgnore: true */ "/api/test-api?no-cache"),
  () => import(/* webpackIgnore: true */ "/api/test-api"),
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
            <TestStatic />
          </li>

          <li>
            <Suspense fallback={<div>Loading...</div>}>
              <TestSource />
            </Suspense>
          </li>

          <li>
            <Suspense fallback={<div>Loading...</div>}>
              <TestPublic />
            </Suspense>
          </li>

          <li>
            <Suspense fallback={<div>Loading...</div>}>
              <TestApi />
            </Suspense>
          </li>
        </ul>
      </div>
    </Layout>
  );
};
export default Index;

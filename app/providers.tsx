"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import PostHogPageView from "./PostHogPageView"; 

// 1. Initialize PostHog outside the component
if (typeof window !== "undefined") {
	posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
		api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
		person_profiles: "identified_only",
		capture_pageview: false, 
		autocapture: true, 
		defaults: "2025-11-30",
	});
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
	return (
		<PHProvider client={posthog}>
			<PostHogPageView />
			{children}
		</PHProvider>
	);
}
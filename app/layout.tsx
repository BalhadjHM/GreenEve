import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono } from "next/font/google";
import "./globals.css";

import LightRays from "@/components/LightRays";
import Navbar from "@/components/Navbar";

const schibestedGrotesk = Schibsted_Grotesk({
	variable: "--font-schibsted-grotesk",
	subsets: ["latin"],
});

const martianMono = Martian_Mono({
	variable: "--font-martian-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "GreenEVE",
	description: "The biggest Hub for events in Algeria",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${schibestedGrotesk.variable} ${martianMono.variable} min-h-screen antialiased`}
			>
                <Navbar />
				<div className="absolute inset-0 top-0 z-[-1] min-h-screen">
					<LightRays
						raysOrigin="top-center-offset"
						raysColor="#5dfeca"
						raysSpeed={0.5}
						lightSpread={0.9}
						rayLength={1.4}
						followMouse={true}
						mouseInfluence={0.05}
						noiseAmount={0}
						distortion={0.1}
						className="custom-rays"
						pulsating={false}
						fadeDistance={1}
						saturation={1}
					/>
				</div>
				<main>
                    {children}
                </main>
			</body>
		</html>
	);
}

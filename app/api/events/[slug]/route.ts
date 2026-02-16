import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Event from "@/database/event.model";

interface RouteParams {
	params: {
		slug: string;
	};
}

export async function GET(
	request: NextRequest,
	{ params }: RouteParams,
) {
	try {
		// Connect to database
		await connectDB();

		const { slug } = await params;

		// Validate slug parameter
		if (!slug || typeof slug !== "string" || slug.trim() === "") {
			return NextResponse.json(
				{ message: "Invalid or missing slug parameter." },
				{ status: 400 },
			);
		}

		// Query event by slug (case-insensitive)
		const event = await Event.findOne({ slug: slug.trim().toLowerCase() });

		// Handle not found
		if (!event) {
			return NextResponse.json(
				{ message: `Event with slug "${slug}" not found.` },
				{ status: 404 },
			);
		}

		// Return success response
		return NextResponse.json(
			{
				message: "Event fetched successfully.",
				event,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error fetching event by slug:", error);
		return NextResponse.json(
			{
				message: "An error occurred while fetching the event.",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}

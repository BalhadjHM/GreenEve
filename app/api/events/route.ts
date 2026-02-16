import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Event from "@/database/event.model";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
	try {
		await connectDB();
		const formData = await request.formData();

		// Convert form data to an object
		const event = Object.fromEntries(formData.entries());

		// Validate required fields
		if (!event.title || !event.description || !event.date) {
			return NextResponse.json(
				{ message: "Missing required fields." },
				{ status: 400 },
			);
		}

		// Validate Cloudinary configuration
		if (
			!process.env.CLOUDINARY_CLOUD_NAME ||
			!process.env.CLOUDINARY_API_KEY ||
			!process.env.CLOUDINARY_API_SECRET
		) {
			return NextResponse.json(
				{
					message:
						"Server configuration error: Cloudinary not configured",
				},
				{ status: 500 },
			);
		}

		// Handle image upload to Cloudinary
		const file = formData.get("image") as File | null;
		if (!file) {
			return NextResponse.json(
				{ message: "Image file is required." },
				{ status: 400 },
			);
		}

        const tags = JSON.parse(formData.get("tags") as string || "[]");
        const agenda = JSON.parse(formData.get("agenda") as string || "[]");

		// Convert file to base64
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

		// Upload to Cloudinary
		const uploadResult = await cloudinary.uploader.upload(base64Image, {
			folder: "GreenEve",
			resource_type: "image",
			transformation: [
				{ width: 1920, height: 1080, crop: "limit" },
				{ quality: "auto" },
			],
		});

		// Set the image URL in the event object
		event.image = uploadResult.secure_url;

		// Create the event in the database
		const createdEvent = await Event.create({
            ...event, 
            tags: tags,
            agenda: agenda,
        });

		return NextResponse.json(
			{
				message: "Event created successfully.",
				event: createdEvent,
			},
			{ status: 201 },
		);
	} catch (error) {
		console.error("Event creation error:", error);
		return NextResponse.json(
			{
				message: "An error occurred while creating the event.",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}

export async function GET() {
	try {
		await connectDB();
		const events = await Event.find({}).sort({ createdAt: -1 });

		return NextResponse.json(
			{
				message: "Events fetched successfully.",
				events,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error("Events fetch error:", error);
		return NextResponse.json(
			{
				message: "An error occurred while fetching events.",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}

// a route that accepts a slug as an input and returns the event details
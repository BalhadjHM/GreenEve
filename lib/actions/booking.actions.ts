'use server';
import connectDB from "../mongodb";
import Booking from "@/database/booking.model";

export const CreateBooking = async ({
	eventId,
	email,
	slug,
}: {
	eventId: string;
	email: string;
	slug: string;
}) => {
	{
		try {
			await connectDB();
			await Booking.create({ eventId, email, slug });

			return { success: true};
		} catch (error) {
			console.error("Error creating booking:", error);
			return {
				success: false,
				message: "Failed to create booking. Please try again later.",
			};
		}
	}
};

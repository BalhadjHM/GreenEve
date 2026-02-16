"use client";
import { CreateBooking } from "@/lib/actions/booking.actions";
import posthog from "posthog-js";
import React from "react";

const BookEvent = ({ eventId, slug }: { eventId: string; slug: string }) => {
	const [email, setEmail] = React.useState("");
	const [submitted, setSubmitted] = React.useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

        const { success } = await CreateBooking({
			eventId,
			email,
			slug,
		});

		if (success) {
			setSubmitted(true);
            posthog.capture('event_booked', {
                eventId,
                slug,
                email,
            });
		} else {
			console.error("Booking failed");
            posthog.captureException('Booking Creation Failed');
		}
	};

	return (
		<div id="book-event">
			{submitted ? (
				<p className="text-sm text-green-600">
					Thank you for booking! We will send you an email with the
					details.
				</p>
			) : (
				<form className="booking-form" onSubmit={handleSubmit}>
					<div>
						<label htmlFor="email-input">Email Address</label>
						<input
							type="email"
							id="email-input"
							placeholder="Enter your email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<button type="submit" className="button-submit">
						Book Now
					</button>
				</form>
			)}
		</div>
	);
};

export default BookEvent;

"use client";
import React from "react";

const BookEvent = () => {
	const [email, setEmail] = React.useState("");
	const [submitted, setSubmitted] = React.useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setTimeout(() => {
            setSubmitted(true);
        }, 1000);
    }

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
                    <button
                        type="submit"
                        className="button-submit"
                    >
                        Book Now
                    </button>
				</form>
			)}
		</div>
	);
};

export default BookEvent;

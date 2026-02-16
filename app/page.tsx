import EventCard from "@/components/EventCard";
import ExploareBtn from "@/components/ExploareBtn";
import { IEvent } from "@/database/event.model";
import { cacheLife } from "next/cache";
import React from "react";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const Home = async () => {
    'use cache';
    cacheLife('hours'); 
	try {
		const response = await fetch(`${baseUrl}/api/events`, {
			cache: "no-store",
		});

		if (!response.ok) {
			throw new Error("Failed to fetch events");
		}

		const data = await response.json();
		const events = data.events || [];

		return (
			<section>
				<h1 className="text-center capitalize">
					The Biggest Hub for events in Algeria
					<br />
					Do not miss out!
				</h1>
				<p className="text-center mt-5">
					Conferences, Workshops, Meetups, and more! all in one place.
				</p>

				<ExploareBtn />

				<div className="mt-20 space-y-7">
					<h3>Featured Events</h3>
					{events.length === 0 ? (
						<p>No events found</p>
					) : (
						<ul className="events">
							{events.map((event: IEvent) => (
								<li
									key={event.title}
									className="event-card list-none"
								>
									<EventCard {...event} />
								</li>
							))}
						</ul>
					)}
				</div>
			</section>
		);
	} catch (error) {
		console.error("Error fetching events:", error);
		return (
			<section>
				<p>Error loading events. Please try again later.</p>
			</section>
		);
	}
};

export default Home;

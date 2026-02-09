import EventCard from "@/components/EventCard";
import ExploareBtn from "@/components/ExploareBtn";
import React from "react";
import { events } from "@/lib/constants";

const Home = () => {
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
				<ul className="events">
					{events.map((event, index) => (
						<li key={index} className="event-card list-none">
							<EventCard {...event} />
						</li>
					))}
				</ul>
			</div>
		</section>
	);
};

export default Home;

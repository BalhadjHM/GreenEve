import { notFound } from "next/navigation";
import React from "react";
import Image from "next/image";
import BookEvent from "@/components/BookEvent";
import { IEvent } from "@/database";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import EventCard from "@/components/EventCard";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const EventDetailsItem = ({
	icon,
	label,
	alt,
}: {
	icon: string;
	label: string;
	alt: string;
}) => (
	<div className="flex-row-gap-2 items-center">
		<Image src={icon} alt={alt} width={17} height={17} />
		<p>{label}</p>
	</div>
);

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
	<div className="agenda">
		<h2>Agenda</h2>
		<ul className="list-disc list-inside">
			{agendaItems.map((item, index) => (
				<li key={index}>{item}</li>
			))}
		</ul>
	</div>
);

const EventTags = ({ tags }: { tags: string[] }) => (
	<div className="flex flex-row gap-1.5 flex-wrap">
		{tags.map((tag, index) => (
			<div className="pill" key={index}>
				{tag}
			</div>
		))}
	</div>
);

const EventDetailsPage = async ({
	params,
}: {
	params: Promise<{ slug: string }>;
}) => {
	const { slug } = await params;
	const request = await fetch(`${baseUrl}/api/events/${slug}`);
	const {
		event: {
			title,
			description,
			date,
			location,
			overview,
			agenda,
			image,
			time,
			mode,
			audience,
			tags,
			organizer,
		},
	} = await request.json();

	if (!title) return notFound();

	const bookings = 10;

	const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug);

	return (
		<section id="event">
			<div className="header">
				<h1>
					Event Details: <br /> {slug}
				</h1>
				<p>{description}</p>
			</div>

			<div className="details">
				{/* Event Content */}
				<div className="content">
					<Image
						src={image}
						alt="event-banner"
						width={800}
						height={800}
						className="banner"
					/>

					<section className="flex-col-gap-2 ">
						<h2>Overview</h2>
						<p>{overview}</p>
					</section>

					<section className="flex-col-gap-2 ">
						<h2>Event Details</h2>
						<EventDetailsItem
							icon="/icons/calendar.svg"
							label={new Date(date).toLocaleDateString()}
							alt="calendar"
						/>
						<EventDetailsItem
							icon="/icons/clock.svg"
							label={time}
							alt="clock"
						/>
						<EventDetailsItem
							icon="/icons/pin.svg"
							label={location}
							alt="location"
						/>
						<EventDetailsItem
							icon="/icons/mode.svg"
							label={mode}
							alt="mode"
						/>
						<EventDetailsItem
							icon="/icons/audience.svg"
							label={audience}
							alt="audience"
						/>
					</section>

					<EventAgenda agendaItems={agenda} />

					<section className="flex-col gap-2">
						<h2>About the Organizer</h2>
						<p>{organizer}</p>
					</section>

					<EventTags tags={tags} />
				</div>

				{/* Booking Form */}
				<aside className="booking">
					<div className="signup-card">
						<h2>Book Your Spot</h2>
						{bookings > 0 ? (
							<p className="text-sm">
								Join {bookings} other people attending this
								event
							</p>
						) : (
							<p className="text-sm">
								Be the first to book this event
							</p>
						)}
						<BookEvent />
					</div>
				</aside>
			</div>

			<div className="pt-20 w-full flex flex-col gap-4">
				<h2>Similar Events</h2>
				<div className="events">
					{similarEvents.length > 0 ? (
						similarEvents.map((event: IEvent) => (
							<EventCard key={event.slug} {...event} />
						))
					) : (
						<p>No similar events found.</p>
					)}
				</div>
			</div>
		</section>
	);
};

export default EventDetailsPage;

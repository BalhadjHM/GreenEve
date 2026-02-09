import React from 'react'
import Link from 'next/link';
import Image from 'next/image';

interface props {
    slug: string;
    title: string;
    image: string;
    location?: string;
    date?: string;
    time?: string;
}

const EventCard = ( { slug, title, image, location, date, time }: props ) => {
  return (
		<Link href={`/events/${slug}`} id='event-card'>
			<Image src={image} alt={title} width={410} height={300} className='poster' />
            <div className='flex flex-row gap-2'>
                <Image src="/icons/pin.svg" alt="Location Icon" width={14} height={14} />
                <p>{location}</p>
            </div>
            <p className='title'>{title}</p>
            <div className='datetime'>
                <div className='date'>
                    <Image src="/icons/calendar.svg" alt="Calendar Icon" width={14} height={14} />
                    <p>{date}</p>
                </div>git remote add origin https://github.com/BalhadjHM/GreenEve.git
                <div className='time'>
                    <Image src="/icons/clock.svg" alt="Clock Icon" width={14} height={14} />
                    <p>{time}</p>
                </div>
            </div>
		</Link>
  );
}

export default EventCard
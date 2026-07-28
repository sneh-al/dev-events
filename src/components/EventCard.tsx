"use client";
import Image from "next/image";
import Link from "next/link";
import posthog from "posthog-js";
import type { EventItem } from "@/lib/constants";

const EventCard = ({ title, image, location, slug, date, time }: EventItem) => {
  const handleClick = () => {
    posthog.capture("event_card_clicked", {
      event_title: title,
      event_slug: slug,
      event_location: location,
      event_date: date,
    });
  };

  return (
    <Link href={`/events/${slug}`} id="event-card" onClick={handleClick}>
      <Image
        src={image}
        alt={title}
        width={410}
        height={300}
        className="poster"
      />
      <div className="flex gap-2 flex-row">
        <Image src="/icons/pin.svg" alt="location" width={12} height={14} />
        <p>{location}</p>
      </div>
      <p className="title">{title}</p>
      <div className="datetime">
        <div className="flex gap-2 flex-row">
          <Image
            src="/icons/calendar.svg"
            alt="location"
            width={12}
            height={14}
          />
          <p>{date}</p>
        </div>
        <div className="flex gap-2 flex-row">
          <Image src="/icons/clock.svg" alt="location" width={12} height={14} />
          <p>{time}</p>
        </div>
      </div>
    </Link>
  );
};
export default EventCard;

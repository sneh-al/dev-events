import { ExploreBtn } from "@/components/ExploreBtn";
import EventCard from "@/components/EventCard";
import events from "@/lib/constants";

export default function Home() {
  return (
    <main>
      <section>
        <h1 className="text-center">
          The Event Hub for every dev <br /> Event you can't miss
        </h1>
        <p className="text-center mt-5">
          Hacathones, Meetup, and conferences, All in one
        </p>
        <ExploreBtn />

        <div className="mt-20 space-y-7">
          <h3>Fetured Events</h3>

          <ul className="events">
            {events.map((event) => (
              <EventCard
                key={event.slug}
                title={event.title}
                image={event.image}
                location={event.location}
                date={event.date}
                time={event.time}
                slug={event.slug}
              />
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

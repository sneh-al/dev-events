import mongoose, { Schema } from 'mongoose';
import type { Document, Model } from 'mongoose';

/**
 * Event document interface
 */
interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Event model interface
 */
interface IEventModel extends Model<IEvent> { }

/**
 * Generate URL-friendly slug from title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Normalize date to ISO format
 */
function normalizeDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }
  return date.toISOString().split('T')[0];
}

/**
 * Normalize time to HH:MM format
 */
function normalizeTime(timeString: string): string {
  const timeRegex = /^(\d{1,2}):(\d{2})(\s*(AM|PM))?$/i;
  const match = timeString.trim().match(timeRegex);

  if (!match) {
    throw new Error('Invalid time format. Use HH:MM or HH:MM AM/PM');
  }

  let hours = parseInt(match[1]);
  const minutes = match[2];
  const period = match[4]?.toUpperCase();

  if (period) {
    // Convert 12-hour to 24-hour format
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
  }

  if (hours < 0 || hours > 23 || parseInt(minutes) < 0 || parseInt(minutes) > 59) {
    throw new Error('Invalid time values');
  }

  return `${hours.toString().padStart(2, '0')}:${minutes}`;
}

/**
 * Event schema definition
 */
const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
      validate: {
        validator: (value: string) => value.length > 0,
        message: 'Title cannot be empty',
      },
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      validate: {
        validator: (value: string) => value.length > 0,
        message: 'Description cannot be empty',
      },
    },
    overview: {
      type: String,
      required: [true, 'Overview is required'],
      validate: {
        validator: (value: string) => value.length > 0,
        message: 'Overview cannot be empty',
      },
      maxlength: [500, 'Overview cannot exceed 500 characters'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
      validate: {
        validator: (value: string) => value.length > 0,
        message: 'Image URL cannot be empty',
      },
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
      validate: {
        validator: (value: string) => value.length > 0,
        message: 'Venue cannot be empty',
      },
    },
    location: {
      type: String,
      trim: true,
      required: [true, 'Location is required'],
      validate: {
        validator: (value: string) => value.length > 0,
        message: 'Location cannot be empty',
      },
    },
    date: {
      type: String,

      required: [true, 'Date is required'],
      validate: {
        validator: (value: string) => value.length > 0,
        message: 'Date cannot be empty',
      },
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
      validate: {
        validator: (value: string) => value.length > 0,
        message: 'Time cannot be empty',
      },
    },
    mode: {
      type: String,
      required: [true, 'Mode is required'],
      enum: {
        values: ['online', 'offline', 'hybrid'],
        message: 'Mode must be either online, offline, or hybrid',
      },
      validate: {
        validator: (value: string) => value.length > 0,
        message: 'Mode cannot be empty',
      },
    },
    audience: {
      type: String,
      trim: true,
      required: [true, 'Audience is required'],
      validate: {
        validator: (value: string) => value.length > 0,
        message: 'Audience cannot be empty',
      },
    },
    agenda: {
      type: [String],
      trim: true,
      required: [true, 'Agenda is required'],
      validate: {
        validator: (value: string[]) => Array.isArray(value) && value.length > 0,
        message: 'Agenda must be a non-empty array',
      },
    },
    organizer: {
      type: String,
      required: [true, 'Organizer is required'],
      validate: {
        validator: (value: string) => value.length > 0,
        message: 'Organizer cannot be empty',
      },
    },
    tags: {
      trim: true,
      type: [String],
      required: [true, 'Tags are required'],
      validate: {
        validator: (value: string[]) => Array.isArray(value) && value.length > 0,
        message: 'Tags must be a non-empty array',
      },
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Add unique index to slug for faster lookups and uniqueness enforcement
 */
EventSchema.index({ slug: 1 }, { unique: true });


// Create compound index for common queries
EventSchema.index({ date: 1, mode: 1 });


/**
 * Pre-save hook: generate slug from title, normalize date and time
 * Only regenerate slug if title has changed
 */
EventSchema.pre('save', async function (next) {
  const event = this as IEvent;

  // Generate slug only if title changed or document is new
  if (event.isModified('title') || event.isNew) {
    event.slug = generateSlug(event.title);
  }

  // Normalize date to ISO format if it's not already
  if (event.isModified('date')) {
    event.date = normalizeDate(event.date);
  }

  // Normalize time format (HH:MM)
  if (event.isModified('time')) {
    event.time = normalizeTime(event.time);
  }

});

/**
 * Event model
 */
const Event: IEventModel = mongoose.model<IEvent, IEventModel>('Event', EventSchema);

export default Event;

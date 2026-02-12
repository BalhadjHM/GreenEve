import mongoose, { Schema, Document, Model } from 'mongoose';

// TypeScript interface for Booking document
export interface IBooking extends Document {
  eventId: mongoose.Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Booking schema definition
const bookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v: string) {
          // Email validation regex
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Please provide a valid email address',
      },
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

/**
 * Pre-save hook to verify that the referenced event exists
 */
bookingSchema.pre('save', async function (next) {
  // Only validate eventId if it's modified or the document is new
  if (this.isModified('eventId') || this.isNew) {
    try {
      // Dynamically import Event model to avoid circular dependency
      const Event = mongoose.models.Event || (await import('./event.model')).default;
      
      const eventExists = await Event.findById(this.eventId);
      
      if (!eventExists) {
        return next(new Error('Referenced event does not exist'));
      }
    } catch (error) {
      return next(error instanceof Error ? error : new Error('Failed to validate event'));
    }
  }
  
  next();
});

// Create index on eventId for faster queries
bookingSchema.index({ eventId: 1 });

// Export the Booking model
const Booking: Model<IBooking> = mongoose.models.Booking || mongoose.model<IBooking>('Booking', bookingSchema);

// Create compound index on email and eventId to prevent duplicate bookings
bookingSchema.index({ email: 1, eventId: 1 }, { unique: true, name: 'unique_booking' });

export default Booking;

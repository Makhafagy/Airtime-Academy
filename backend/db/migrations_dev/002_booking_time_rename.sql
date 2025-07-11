ALTER TABLE bookings
RENAME COLUMN preferred_time TO pickup_time;

ALTER TABLE bookings
RENAME COLUMN duration_minutes TO dropoff_time;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
    CREATE TYPE booking_status AS ENUM ('Pending', 'Approved', 'Confirmed', 'Cancelled', 'Rejected');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_type') THEN
    CREATE TYPE booking_type AS ENUM ('Rental', 'Instruction');
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  type booking_type NOT NULL,
  preferred_time TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL,
  notes TEXT,
  status booking_status DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bookings_time ON bookings(preferred_time);

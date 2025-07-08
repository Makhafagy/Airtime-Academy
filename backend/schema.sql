CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  type TEXT CHECK (type IN ('Instruction', 'Rental')) NOT NULL,
  preferred_time TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL,
  notes TEXT,
  status TEXT CHECK (
    status IN ('Pending', 'Approved', 'Confirmed', 'Rejected')
  ) DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE booking_responses (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
  instructor_email TEXT,
  decision TEXT CHECK (decision IN ('Approved', 'Rejected')),
  message TEXT,
  responded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_booking_time_type ON bookings(type, preferred_time);
INSERT INTO bookings (
    name,
    email,
    type,
    preferred_time,
    duration_minutes,
    notes,
    status
  )
VALUES (
    'John Doe',
    'john@example.com',
    'Instruction',
    '2025-07-08T10:00:00Z',
    60,
    'Wants to train on crosswinds',
    'Pending'
  );
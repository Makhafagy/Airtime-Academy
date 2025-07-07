CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  type TEXT CHECK (type IN ('Rental', 'Instruction')) NOT NULL,
  preferred_time TIMESTAMP NOT NULL,
  duration_minutes INTEGER NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT now()
);
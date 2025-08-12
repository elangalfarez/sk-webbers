# Treasure Hunt Database Schema

This document outlines the required database schema for the treasure hunt game feature.

## Supabase Setup Instructions

### 1. Create Supabase Project
1. Go to [Supabase](https://supabase.com) and create a new project
2. Copy your project URL and anon key
3. Update `.env` file with your credentials:
   ```
   VITE_SUPABASE_URL=your_project_url_here
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

### 2. Database Tables

Execute the following SQL commands in your Supabase SQL editor:

#### Players Table
```sql
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unique_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_locations TEXT[] DEFAULT '{}',
  total_score INTEGER DEFAULT 0,
  purchase_amount NUMERIC(10,2) NOT NULL,
  is_verified BOOLEAN DEFAULT true
);

-- Create index for faster lookups
CREATE INDEX idx_players_unique_code ON players(unique_code);
CREATE INDEX idx_players_created_at ON players(created_at);
```

#### Treasure Locations Table
```sql
CREATE TABLE treasure_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  qr_code TEXT UNIQUE NOT NULL,
  quiz_question TEXT NOT NULL,
  quiz_options TEXT[] NOT NULL,
  correct_answer INTEGER NOT NULL,
  points INTEGER DEFAULT 100,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for QR code lookups
CREATE INDEX idx_treasure_locations_qr_code ON treasure_locations(qr_code);
CREATE INDEX idx_treasure_locations_active ON treasure_locations(is_active);
```

#### Photo Submissions Table
```sql
CREATE TABLE photo_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  location_id UUID REFERENCES treasure_locations(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  metadata JSONB NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_photo_submissions_player_id ON photo_submissions(player_id);
CREATE INDEX idx_photo_submissions_location_id ON photo_submissions(location_id);
CREATE INDEX idx_photo_submissions_created_at ON photo_submissions(created_at);
```

### 3. Storage Bucket

Create a storage bucket for photos:

```sql
-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('treasure-hunt-photos', 'treasure-hunt-photos', false);
```

### 4. Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE treasure_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_submissions ENABLE ROW LEVEL SECURITY;

-- Players policies
CREATE POLICY "Players can read their own data" ON players
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert players" ON players
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Players can update their own data" ON players
  FOR UPDATE USING (true);

-- Treasure locations policies (read-only for players)
CREATE POLICY "Anyone can read active locations" ON treasure_locations
  FOR SELECT USING (is_active = true);

-- Photo submissions policies
CREATE POLICY "Players can read their own submissions" ON photo_submissions
  FOR SELECT USING (true);

CREATE POLICY "Players can insert their own submissions" ON photo_submissions
  FOR INSERT WITH CHECK (true);
```

### 5. Storage Policies

```sql
-- Allow authenticated users to upload photos
CREATE POLICY "Allow photo uploads" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'treasure-hunt-photos');

-- Allow authenticated users to read photos
CREATE POLICY "Allow photo downloads" ON storage.objects
  FOR SELECT USING (bucket_id = 'treasure-hunt-photos');
```

### 6. Sample Data

Insert some sample treasure locations:

```sql
INSERT INTO treasure_locations (name, description, qr_code, quiz_question, quiz_options, correct_answer, points) VALUES
(
  'Main Entrance Decoration',
  'Beautiful Independence Day decoration at the main entrance',
  'SMK_ENTRANCE_17AGS',
  'What colors are in the Indonesian flag?',
  ARRAY['Red and White', 'Red, White, and Blue', 'Red and Yellow', 'Blue and White'],
  0,
  100
),
(
  'Food Court Flag Display',
  'Traditional flag display in the food court area',
  'SMK_FOODCOURT_17AGS',
  'When is Indonesian Independence Day celebrated?',
  ARRAY['August 17', 'August 30', 'October 17', 'December 17'],
  0,
  150
),
(
  'Kids Area Garuda Statue',
  'Garuda statue decoration in the kids play area',
  'SMK_KIDS_17AGS',
  'What is the national bird of Indonesia?',
  ARRAY['Garuda', 'Eagle', 'Hawk', 'Peacock'],
  0,
  200
);
```

## Data Structure Overview

### Player Journey
1. **Registration**: Player enters purchase amount (min Rp 150,000) and gets unique 6-char code
2. **Location Discovery**: Player scans QR codes at decorated locations
3. **Photo Submission**: Player takes selfie with decorations (with fraud detection)
4. **Quiz**: Player answers location-specific questions for points
5. **Progress Tracking**: System tracks completed locations and total score

### Anti-Fraud Measures
- **Face Detection**: Validates actual faces in selfies using face-api.js
- **EXIF Validation**: Checks photo metadata for authenticity
- **Geolocation**: Captures device location when available
- **Metadata Storage**: Comprehensive tracking of device info and timestamps
- **Duplicate Prevention**: Prevents multiple submissions for same location

### Scoring System
- **Base Points**: Each location has a base point value
- **Speed Bonus**: Up to 20 extra points for quick quiz answers
- **Total Score**: Accumulated across all completed locations

## Required Dependencies

The following npm packages are required:
```json
{
  "@supabase/supabase-js": "^2.x.x",
  "face-api.js": "^0.22.x",
  "piexifjs": "^1.x.x",
  "html5-qrcode": "^2.x.x"
}
```

## Security Considerations

1. **Photo Storage**: Photos are stored in private Supabase storage bucket
2. **Data Validation**: All inputs are validated on both client and server side
3. **Rate Limiting**: Consider implementing rate limits for photo uploads
4. **Content Moderation**: Review photo submissions for inappropriate content
5. **Privacy**: Collect minimal personal data, focus on game mechanics
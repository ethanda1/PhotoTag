# PhotoTag

![PhotoTag Home](https://github.com/user-attachments/assets/a350471b-a8ed-4cd9-9928-eb741824b20d)
PhotoTag is an AI-powered image tagging application that automatically analyzes and organizes your photos using AWS Rekognition.

## Features

-  Upload photos directly to AWS S3
-  Automatic image analysis using AWS Rekognition
-  Smart tagging of image contents
-  Search through photos by tags
-  User authentication and personal galleries

## Tech Stack

### Frontend
- Next.js 13 (React)
- Tailwind CSS
- AWS SDK for JavaScript
- Supabase Auth UI

### Backend
- Flask (Python)
- AWS Rekognition
- AWS S3 for storage

### Database & Auth
- Supabase (PostgreSQL)

### Upload Your Photo
![Upload Photo](https://github.com/user-attachments/assets/5cfeb58b-02b0-4025-8a7e-66cd1f7d9c88)

### Gallery View
![Photo Gallery](https://github.com/user-attachments/assets/67f3bc77-0838-4903-a81b-46acc1206893)


## Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/phototag.git
cd phototag
```

2. Install JavaScript dependencies:
```bash
npm install
# or if using yarn
yarn install
```

3. Install Python dependencies:
```bash
cd backend
oython -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

## Configuration

1. Create a `.env` file in the root directory:
```bash
touch .env
```

2. Add the following environment variables to your `.env` file:
```env
# AWS Configuration
NEXT_PUBLIC_AWS_ACCESS_KEY_ID=your_aws_access_key
NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=your_aws_secret_key
NEXT_PUBLIC_AWS_REGION=your_aws_region
NEXT_PUBLIC_AWS_BUCKET_NAME=your_aws_bucket_name

# AWS Server-side Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_aws_bucket_name

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Development

Start the Flask server:
```bash
Make sure your in /backend
python app.py
```

Start the development server:
```bash
Make sure your in root
npm run dev
# or
yarn dev
```




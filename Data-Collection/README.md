# Data Collection Platform for Hair & Scalp Research

![Banner](attached_assets/banner.png)

## Overview

This project is a full-stack platform for collecting, storing, and analyzing hair and scalp images and metadata for AI-driven research. It is designed for secure, scalable deployment on AWS, with best practices for data privacy and cloud storage.

---

## Features

- **Modern React Frontend** (Vite, Tailwind)
  - Responsive, user-friendly UI
  - Progress tracker and consent flow
  - Image upload with preview
  - Metadata form with validation
- **Express Backend**
  - REST API for data and image submission
  - Multer for file handling
  - AWS S3 integration for image storage
  - PostgreSQL/Drizzle ORM for metadata
- **Cloud-Ready Architecture**
  - Static frontend deployable to S3 + CloudFront
  - Backend deployable to Elastic Beanstalk
  - Secure environment variable management
- **Research Compliance**
  - Consent tracking
  - Data anonymization
  - Secure storage and access

---

## How to Use

### 1. Local Development

```bash
# Install dependencies
npm install

# Start backend (Express)
npm run dev

# Build frontend
npm run build
```

### 2. AWS Deployment

- **Frontend:**
  - Build with `npm run build`
  - Upload `dist/` to S3 bucket
  - Set up CloudFront for CDN/HTTPS
- **Backend:**
  - Deploy to Elastic Beanstalk (Node.js)
  - Set environment variables (`DATABASE_URL`, `AWS_ACCESS_KEY_ID`, etc.)
- **Images:**
  - Automatically stored in S3 via backend API

---

## Environment Variables

Create a `.env` file with:
```
DATABASE_URL=your_postgres_url
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
S3_BUCKET_NAME=your_bucket_name
```

### Elastic Beanstalk Deployment (Backend)

Requirements
- AWS CLI + EB CLI configured and logged in
- EB Platform: Node.js 20 running on 64bit Amazon Linux 2023

Environment variables on EB
- `NODE_ENV=production`
- `DATABASE_URL=<postgres url>`
- `UPLOAD_DIR=/tmp` (optional; default used in prod)
- For S3 uploads (recommended):
  - `AWS_REGION=<region>`
  - `S3_BUCKET=<bucket-name>`

Notes
- Run once on your Postgres DB: `CREATE EXTENSION IF NOT EXISTS pgcrypto;`
- Nginx upload limit set to 20MB via `.platform/nginx/conf.d/proxy.conf`

---

## Folder Structure

```
client/           # React frontend
server/           # Express backend
shared/           # Schemas and types
uploads/          # (local only) image uploads
migrations/       # Database migrations
attached_assets/  # Static assets
```

---

## Contributing

Pull requests and issues are welcome! Please follow best practices for code style and commit messages.

---

## License

MIT

---

## Contact

For questions or collaboration, contact [Abhinav Vasudevan](mailto:abhinav.vasudevan5@gmail.com)

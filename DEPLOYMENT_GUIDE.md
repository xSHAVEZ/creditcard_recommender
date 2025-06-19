# 🚀 Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the AI-Powered Credit Card Recommendation System to production environments.

## 🌐 Frontend Deployment (Vercel)

### Prerequisites
- Vercel account (free tier available)
- Git repository connected to Vercel

### Step 1: Prepare Frontend for Deployment

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

3. **Login to Vercel**
   ```bash
   vercel login
   ```

### Step 2: Configure Environment Variables

Create a `.env` file in the client directory:
```env
REACT_APP_API_URL=https://your-backend-url.com
```

### Step 3: Deploy to Vercel

1. **Deploy from client directory**
   ```bash
   vercel
   ```

2. **Follow the prompts:**
   - Set up and deploy: `Y`
   - Which scope: Select your account
   - Link to existing project: `N`
   - Project name: `credit-card-recommender-frontend`
   - Directory: `./` (current directory)
   - Override settings: `N`

3. **Set environment variables in Vercel dashboard:**
   - Go to your project settings
   - Navigate to Environment Variables
   - Add `REACT_APP_API_URL` with your backend URL

### Step 4: Custom Domain (Optional)

1. **Add custom domain in Vercel dashboard**
2. **Configure DNS settings**
3. **Enable HTTPS (automatic with Vercel)**

### Step 5: Verify Deployment

- Visit your deployed URL
- Test all features (chat, recommendations, compare)
- Verify API connectivity

## 🖥️ Backend Deployment (Railway)

### Prerequisites
- Railway account
- Git repository

### Step 1: Prepare Backend for Deployment

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

3. **Login to Railway**
   ```bash
   railway login
   ```

### Step 2: Initialize Railway Project

1. **Initialize new project**
   ```bash
   railway init
   ```

2. **Link to existing project (if applicable)**
   ```bash
   railway link
   ```

### Step 3: Configure Environment Variables

Set environment variables in Railway dashboard:

```env
PORT=5000
NODE_ENV=production
OPENAI_API_KEY=your_openai_api_key_here
JWT_SECRET=your_jwt_secret_here
SESSION_SECRET=your_session_secret_here
```

### Step 4: Deploy to Railway

1. **Deploy the application**
   ```bash
   railway up
   ```

2. **Check deployment status**
   ```bash
   railway status
   ```

3. **View logs**
   ```bash
   railway logs
   ```

### Step 5: Configure Domain

1. **Get your Railway URL**
   ```bash
   railway domain
   ```

2. **Update frontend environment variable**
   - Set `REACT_APP_API_URL` to your Railway URL

## 🐳 Docker Deployment

### Frontend Dockerfile

Create `client/Dockerfile`:
```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `client/nginx.conf`:
```nginx
server {
    listen 80;
    server_name localhost;
    
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://backend:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Backend Dockerfile

Create `server/Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "index.js"]
```

### Docker Compose

Create `docker-compose.yml` in root directory:
```yaml
version: '3.8'

services:
  frontend:
    build: ./client
    ports:
      - "80:80"
    depends_on:
      - backend
    environment:
      - REACT_APP_API_URL=http://localhost/api

  backend:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - JWT_SECRET=${JWT_SECRET}
      - SESSION_SECRET=${SESSION_SECRET}
    volumes:
      - ./server/database.sqlite:/app/database.sqlite

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - frontend
      - backend
```

### Deploy with Docker

1. **Build and run**
   ```bash
   docker-compose up --build
   ```

2. **Run in background**
   ```bash
   docker-compose up -d
   ```

3. **Stop services**
   ```bash
   docker-compose down
   ```

## ☁️ Cloud Deployment Options

### AWS Deployment

#### Frontend (S3 + CloudFront)

1. **Create S3 bucket**
   ```bash
   aws s3 mb s3://your-app-name
   ```

2. **Build and upload**
   ```bash
   cd client
   npm run build
   aws s3 sync build/ s3://your-app-name
   ```

3. **Configure CloudFront**
   - Create distribution
   - Set S3 as origin
   - Configure custom domain

#### Backend (EC2)

1. **Launch EC2 instance**
2. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Deploy application**
   ```bash
   git clone your-repo
   cd server
   npm install
   npm start
   ```

4. **Configure PM2**
   ```bash
   npm install -g pm2
   pm2 start index.js --name "credit-card-api"
   pm2 startup
   pm2 save
   ```

### Google Cloud Platform

#### Frontend (Firebase Hosting)

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize Firebase**
   ```bash
   firebase login
   firebase init hosting
   ```

3. **Deploy**
   ```bash
   cd client
   npm run build
   firebase deploy
   ```

#### Backend (Cloud Run)

1. **Create Dockerfile** (see Docker section)
2. **Build and push**
   ```bash
   gcloud builds submit --tag gcr.io/PROJECT_ID/credit-card-api
   ```

3. **Deploy to Cloud Run**
   ```bash
   gcloud run deploy credit-card-api \
     --image gcr.io/PROJECT_ID/credit-card-api \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

## 🔧 Environment Configuration

### Production Environment Variables

#### Frontend (.env.production)
```env
REACT_APP_API_URL=https://your-backend-url.com
REACT_APP_ENVIRONMENT=production
```

#### Backend (.env.production)
```env
NODE_ENV=production
PORT=5000
OPENAI_API_KEY=your_openai_api_key_here
JWT_SECRET=your_secure_jwt_secret_here
SESSION_SECRET=your_secure_session_secret_here
DATABASE_URL=sqlite:./database.sqlite
CORS_ORIGIN=https://your-frontend-url.com
```

### Security Considerations

1. **Generate secure secrets**
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

2. **Use HTTPS in production**
3. **Implement rate limiting**
4. **Set up monitoring and logging**
5. **Configure CORS properly**

## 📊 Monitoring & Logging

### Application Monitoring

1. **Set up health checks**
   ```javascript
   app.get('/health', (req, res) => {
     res.json({ status: 'OK', timestamp: new Date().toISOString() });
   });
   ```

2. **Implement logging**
   ```javascript
   const winston = require('winston');
   
   const logger = winston.createLogger({
     level: 'info',
     format: winston.format.json(),
     transports: [
       new winston.transports.File({ filename: 'error.log', level: 'error' }),
       new winston.transports.File({ filename: 'combined.log' })
     ]
   });
   ```

3. **Set up error tracking**
   - Sentry for error monitoring
   - LogRocket for session replay
   - Google Analytics for user behavior

### Performance Monitoring

1. **Database monitoring**
   - Monitor query performance
   - Set up alerts for slow queries

2. **API monitoring**
   - Track response times
   - Monitor error rates
   - Set up uptime monitoring

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./client

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        uses: bervProject/railway-deploy@v1.0.0
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: credit-card-api
```

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check CORS configuration
   - Verify frontend URL in backend settings

2. **Database Issues**
   - Ensure database file is writable
   - Check database path in production

3. **API Connection Issues**
   - Verify environment variables
   - Check network connectivity
   - Validate API endpoints

4. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Review build logs for errors

### Debug Commands

```bash
# Check application status
pm2 status

# View logs
pm2 logs

# Restart application
pm2 restart credit-card-api

# Check environment variables
printenv | grep REACT_APP
```

## 📞 Support

For deployment issues:
1. Check the troubleshooting section
2. Review platform-specific documentation
3. Contact platform support
4. Create an issue in the repository

---

This deployment guide covers the most common deployment scenarios. Choose the method that best fits your infrastructure and requirements. 
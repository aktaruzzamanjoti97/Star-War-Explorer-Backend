# Star Wars Explorer

A modern web application for exploring the Star Wars universe, built with Next.js 15, React 19, and Express.js.

## 🌟 Features

- **Character Browser**: Browse through all Star Wars characters with pagination
- **Advanced Search**: Search characters by name with intelligent debouncing (500ms delay)
  - Automatic search as you type
  - Loading indicators during search
  - Clear button to reset search
- **Detailed Character Profiles**: View comprehensive information about each character including:
  - Basic information (birth year, gender, homeworld)
  - Physical characteristics (height, weight, eye color, hair color)
  - Film appearances
  - Vehicles and starships
  - Species information
- **Modern UI**: Beautiful, responsive design with Star Wars themed styling
- **Performance Optimized**: 
  - Server-side caching and optimized data fetching
  - Debounced search to reduce API calls
  - React Query for intelligent client-side caching
- **TypeScript**: Full type safety across the application

## 🚀 Tech Stack

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **Axios**: HTTP client for API requests
- **Node-Cache**: In-memory caching for performance

## 📋 Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager
- Git

## 🛠️ Installation Guide

### 1. Clone the Repository

```bash
git clone https://github.com/aktaruzzamanjoti97/Star-War-Explorer-Backend.git
cd star-wars-explorer
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (optional)
echo "PORT=5000" > .env

# Start the backend server
npm run dev
```

The backend server will start on `http://localhost:5000`

## 🏗️ Project Structure

```
star-wars-explorer/
├── backend/
│   ├── server.js           # Express server setup
│   ├── package.json        # Backend dependencies
│   └── .env               # Environment variables
```

## 🔧 Configuration

### Backend Configuration

Create a `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development
CACHE_TTL=3600
```

## 🌐 API Endpoints

The backend provides the following endpoints:

- `GET /api/health` - Health check
- `GET /api/people?page=1&search=luke` - Get characters with pagination and search
- `GET /api/people/:id` - Get single character details
- `GET /api/people/:id/films` - Get character's film appearances
- `GET /api/people/:id/species` - Get character's species
- `GET /api/people/:id/vehicles` - Get character's vehicles
- `GET /api/people/:id/starships` - Get character's starships












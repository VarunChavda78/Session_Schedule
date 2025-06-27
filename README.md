# Thursday Session Schedule

A modern web application for managing your company's Thursday sessions. Built with React frontend and Node.js backend, fully containerized with Docker.

## Features

- **Beautiful UI**: Modern, responsive design with smooth animations
- **Role-based Access**: Only owners can add/edit sessions, others can only view
- **Real-time Updates**: Instant feedback with toast notifications
- **Secure Authentication**: JWT-based authentication system
- **Mobile Responsive**: Works perfectly on all devices
- **Docker Ready**: Easy deployment with Docker Compose

## Tech Stack

### Frontend
- React 18
- React Router for navigation
- Axios for API calls
- React Hot Toast for notifications
- Lucide React for icons
- Date-fns for date formatting

### Backend
- Node.js with Express
- JWT for authentication
- bcryptjs for password hashing
- CORS enabled
- File-based JSON storage (easily upgradable to database)

### Infrastructure
- Docker & Docker Compose
- Nginx for frontend serving and API proxying
- Multi-stage builds for optimized images

## Quick Start with Docker

### Prerequisites
- Docker
- Docker Compose

### Deployment

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd Thursday_Session_Schedule
   ```

2. **Start the application:**
   ```bash
   docker-compose up -d
   ```

3. **Access the application:**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:5000

### Default Login Credentials
- **Username:** `owner`
- **Password:** `admin123`

## Manual Development Setup

If you prefer to run the application locally for development:

1. **Install dependencies:**
   ```bash
   npm run install-all
   ```

2. **Start development servers:**
   ```bash
   npm run dev
   ```

## Project Structure

```
Thursday_Session_Schedule/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   └── index.css       # Global styles
│   └── package.json
├── server/                 # Node.js backend
│   ├── data/              # JSON data files
│   ├── index.js           # Main server file
│   └── package.json
├── Dockerfile.client      # Frontend Dockerfile
├── Dockerfile.server      # Backend Dockerfile
├── docker-compose.yml     # Docker Compose configuration
├── nginx.conf             # Nginx configuration
├── package.json           # Root package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with username/password

### Sessions (Public)
- `GET /api/sessions` - Get all sessions

### Sessions (Owner Only)
- `POST /api/sessions` - Create new session
- `PUT /api/sessions/:id` - Update session
- `DELETE /api/sessions/:id` - Delete session

### User
- `GET /api/profile` - Get current user profile

## Usage

### For Owners
1. Login with owner credentials
2. Click "Add Session" to create new Thursday sessions
3. Edit or delete existing sessions using the action buttons
4. All changes are saved immediately

### For Viewers
1. Visit the website (no login required)
2. Browse all Thursday sessions
3. View session details including time, date, presenter, and description

## Docker Commands

### Start the application
```bash
docker-compose up -d
```

### Stop the application
```bash
docker-compose down
```

### View logs
```bash
docker-compose logs -f
```

### Rebuild containers
```bash
docker-compose up -d --build
```

### Remove all containers and volumes
```bash
docker-compose down -v
```

## Environment Variables

You can customize the application by setting environment variables in the `docker-compose.yml` file:

- `JWT_SECRET`: Secret key for JWT tokens (change in production)
- `PORT`: Backend server port (default: 5000)
- `NODE_ENV`: Environment mode (production/development)

## Customization

### Adding More Users
The user data is stored in `server/data/users.json`. You can add more users by editing this file or through the API.

### Styling
Modify `client/src/index.css` to customize the appearance.

### Database Integration
Replace the file-based storage in `server/index.js` with your preferred database (MongoDB, PostgreSQL, etc.).

## Production Deployment

### Security Considerations
1. Change the `JWT_SECRET` in `docker-compose.yml`
2. Use HTTPS in production
3. Set up proper firewall rules
4. Consider using a reverse proxy like Traefik

### Scaling
- The application can be easily scaled horizontally
- Consider using a proper database for production
- Set up monitoring and logging

## Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Check what's using the port
   netstat -tulpn | grep :3001
   # Or change ports in docker-compose.yml
   ```

2. **Permission issues:**
   ```bash
   # Make sure Docker has proper permissions
   sudo usermod -aG docker $USER
   ```

3. **Container won't start:**
   ```bash
   # Check logs
   docker-compose logs backend
   docker-compose logs frontend
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your company's needs!

## Support

If you encounter any issues or have questions, please open an issue on the repository. 
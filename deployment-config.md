# Deployment Configuration

## Server Configuration

The application can be configured via the `config.json` file in the root directory.

### Configuration File Structure

```json
{
  "server": {
    "host": "0.0.0.0",
    "port": 5000
  },
  "app": {
    "name": "Hypersonic Habit Tracker",
    "description": "A web-based self-discipline and habit tracker with Bangladesh timezone integration"
  }
}
```

### Configuration Options

- **host**: The IP address to bind the server to (default: `0.0.0.0` for all interfaces)
- **port**: The port number to serve the application on (default: `5000`)
- **app.name**: The display name of the application
- **app.description**: A brief description of the application

### Environment Variable Override

The `PORT` environment variable will override the port setting in config.json if set.

### Accessing the Application

Once started, the application will be available at:
- Local: `http://localhost:5000`
- Network: `http://[your-ip]:5000`

## Data Storage

All user data is stored in the browser's local storage:

- **Daily Goals**: Stored locally in the browser
- **Habits**: Stored locally in the browser  
- **Activity Log**: Stored locally in the browser
- **Application Settings**: Stored locally in the browser

### Local Storage Keys

- `hypersonic-data`: Main application data including goals, habits, and activity log

### Benefits of Local Storage

1. **Privacy**: All data stays on the user's device
2. **No Database Required**: No need for external database setup
3. **Offline Capable**: Works without internet connection
4. **Fast Access**: Instant data retrieval
5. **No Data Loss**: Data persists between browser sessions

## Starting the Application

1. Configure `config.json` with desired host and port
2. Run `npm run dev` 
3. Access the application at the configured host:port

## Network Access

To make the application accessible from other devices on the network:

1. Set `host` to `"0.0.0.0"` in config.json (default)
2. Set the desired `port` in config.json
3. Ensure the port is not blocked by firewall
4. Access from other devices using `http://[server-ip]:[port]`

## Bangladesh Timezone Features

The application automatically handles Bangladesh timezone (UTC+6) for:
- Time display
- Daily reset at midnight Bangladesh time
- Date highlighting in calendar
- Activity logging
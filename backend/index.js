const express = require('express'); // 1. Imports the web framework to create our API routes.
const cors = require('cors');       // 2. Imports Cross-Origin Resource Sharing security rules.
require('dotenv').config();         // 3. Allows the app to read secret passwords from a hidden file.

const app = express();              // 4. Instantiates your server engine application.
const PORT = 5001; // 5. Assigns a network communication port (Local: 5000).

// Middleware (Code that processes data *before* it reaches your endpoints)
app.use(cors());          // 6. Security bridge: Permits your future React app to talk to this server.
app.use(express.json());  // 7. Parser: Teaches the server to read incoming JSON object payloads.

// Main entry verification route (An Endpoint)
app.get('/', (req, res) => {
  // 8. Listen for a browser request ('/') and send back a confirmation text message response.
  res.send('Finly backend engine is breathing smoothly!');
});

// 9. Start the network listener loop
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  
  // Keeps the process alive in agent-wrapped IDE terminals
  setInterval(() => {}, 1000 << 30);
});
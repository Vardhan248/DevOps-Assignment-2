// Import the Express framework
const express = require('express');
const path = require('path');

const app = express();
const port = 3000; 

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  // Ensure we send the correct HTML file name (index.html)
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`\n--- App is running ---\n`);
  console.log(`Server hosted successfully on port ${port}`);
  console.log(`Open your browser at: http://localhost:${port}`);
  console.log(`\n----------------------\n`);
});

require('dotenv').config();
const fs = require('fs');
const https = require('https');
const app = require('./app'); 
const options = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH),
};

const PORT = 3000;

https.createServer(options, app).listen(PORT, () => {
  console.log(`✅ HTTPS server is running at https://localhost:${PORT}`);
});

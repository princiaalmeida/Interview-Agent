const https = require('https');
const { execSync } = require('child_process');

// Generate a self-signed certificate for development
const fs = require('fs');
const path = require('path');

const certDir = path.join(__dirname, 'certs');
const certPath = path.join(certDir, 'cert.pem');
const keyPath = path.join(certDir, 'key.pem');

// Create certs directory if it doesn't exist
if (!fs.existsSync(certDir)) {
  fs.mkdirSync(certDir, { recursive: true });
}

// Generate self-signed certificate if it doesn't exist
if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
  console.log('🔐 Generating self-signed certificate for HTTPS development...');
  try {
    execSync('openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"', {
      cwd: certDir,
      stdio: 'inherit'
    });
    console.log('✅ Certificate generated successfully');
  } catch (error) {
    console.error('❌ Failed to generate certificate:', error.message);
    console.log('💡 Make sure OpenSSL is installed or run: npm install -g openssl');
    process.exit(1);
  }
}

const options = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath)
};

module.exports = {
  httpsOptions: options,
  serverExternalPackages: ['pdf-parse'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'camera=(self), microphone=(self), geolocation=()',
          },
        ],
      },
    ];
  },
}

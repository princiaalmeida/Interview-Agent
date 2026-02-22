const fs = require('fs');
const path = require('path');

// Create certs directory if it doesn't exist
const certsDir = path.join(__dirname, 'certs');
if (!fs.existsSync(certsDir)) {
  fs.mkdirSync(certsDir);
}

// Check if certificates already exist
const keyPath = path.join(certsDir, 'key.pem');
const certPath = path.join(certsDir, 'cert.pem');

if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
  console.log('✅ HTTPS certificates already exist');
  console.log('🔐 Run: npm run dev:https');
  console.log('🌐 Or use ngrok: npm run dev:ngrok');
} else {
  console.log('🔧 Generating HTTPS certificates for camera/microphone access...');
  
  try {
    // Generate self-signed certificate
    const { execSync } = require('child_process');
    execSync(`openssl req -x509 -newkey rsa:2048 -keyout "${keyPath}" -out "${certPath}" -days 365 -nodes -subj "/C=US/ST=State/L=City/O=Dev/CN=localhost"`, { stdio: 'inherit' });
    
    console.log('\n✅ HTTPS certificates generated successfully!');
    console.log('\n🎯 For camera & microphone access, run:');
    console.log('   npm run dev:https  (HTTPS on port 3001)');
    console.log('   npm run dev:ngrok  (Public HTTPS via ngrok)');
    console.log('\n📝 Note: Browser will show "Not Secure" - click "Advanced" → "Proceed to localhost"');
    
  } catch (error) {
    console.log('\n❌ Failed to generate certificates automatically.');
    console.log('\n📋 Manual setup options:');
    console.log('1. Install OpenSSL and run: npm run setup-https');
    console.log('2. Use ngrok for public HTTPS: npm run dev:ngrok');
    console.log('3. Deploy to Vercel/Netlify for production HTTPS');
    
    // Create simple instructions file
    const instructions = `
# HTTPS Setup for Camera/Microphone Access

## Option 1: Self-signed Certificate (Recommended for development)
1. Install OpenSSL
2. Run: npm run setup-https
3. Run: npm run dev:https
4. Accept browser security warning

## Option 2: Use ngrok (Easiest)
1. Run: npm run dev:ngrok
2. Use the ngrok HTTPS URL provided

## Option 3: Manual Certificate Generation
openssl req -x509 -newkey rsa:2048 -keyout certs/key.pem -out certs/cert.pem -days 365 -nodes -subj "/C=US/ST=State/L=City/O=Dev/CN=localhost"

## Why HTTPS is required:
- Camera/microphone access requires secure context
- HTTP is not supported by modern browsers
- Self-signed certificates work for localhost
`;
    
    fs.writeFileSync(path.join(__dirname, 'HTTPS-SETUP.md'), instructions);
    console.log('\n📄 Created HTTPS-SETUP.md with detailed instructions');
  }
}

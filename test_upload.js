const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

async function testUpload() {
    try {
        console.log('1. Attempting login...');
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@agriflow.com',
            password: 'admin'
        });
        const token = loginRes.data.token;
        console.log('   Login successful.');

        console.log('2. Creating dummy image...');
        const dummyPath = path.join(__dirname, 'test-dummy.jpg');
        fs.writeFileSync(dummyPath, 'fake-image-data-' + Date.now());

        console.log('3. Uploading avatar...');
        const form = new FormData();
        form.append('image', fs.createReadStream(dummyPath));

        const uploadRes = await axios.post('http://localhost:5000/api/upload/avatar', form, {
            headers: {
                ...form.getHeaders(),
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('   Upload Response:', uploadRes.data);
        
        console.log('4. Verifying file on disk...');
        const savedPath = path.join(__dirname, uploadRes.data.avatar);
        if (fs.existsSync(savedPath)) {
            console.log('   File exists on disk at:', savedPath);
        } else {
            console.error('   Error: File NOT found on disk at:', savedPath);
        }

        // Cleanup
        fs.unlinkSync(dummyPath);
        process.exit(0);
    } catch (e) {
        console.error('Test failed:', e.response?.data || e.message);
        process.exit(1);
    }
}

testUpload();

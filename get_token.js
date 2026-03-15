const axios = require('axios');
async function getToken() {
    try {
        const res = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@agriflow.com',
            password: 'admin'
        });
        process.stdout.write(res.data.token);
    } catch (e) {
        process.stderr.write(JSON.stringify(e.response?.data || e.message));
        process.exit(1);
    }
}
getToken();

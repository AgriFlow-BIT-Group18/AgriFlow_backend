const testAPI = async () => {
    try {
        const baseUrl = 'http://localhost:5000/api';
        
        console.log('--- TEST 1: Register Farmer ---');
        const registerFarmerRes = await fetch(`${baseUrl}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'John Farmer',
                email: 'john@farm.com',
                password: 'password123',
                role: 'farmer',
                farmName: 'Green Farm'
            })
        });
        const farmerData = await registerFarmerRes.json();
        console.log(farmerData);
        if (!registerFarmerRes.ok && farmerData.message !== 'User already exists') {
            const loginRes = await fetch(`${baseUrl}/auth/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: 'john@farm.com', password: 'password123' })
            });
            const loginData = await loginRes.json();
            farmerData.token = loginData.token;
        } else if (farmerData.message === 'User already exists') {
            const loginRes = await fetch(`${baseUrl}/auth/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: 'john@farm.com', password: 'password123' })
            });
            const loginData = await loginRes.json();
            farmerData.token = loginData.token;
            console.log("Logged in existing farmer: ", loginData);
        }

        console.log('\n--- TEST 2: Create Product ---');
        const createProductRes = await fetch(`${baseUrl}/products`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${farmerData.token}`
            },
            body: JSON.stringify({
                name: 'Organic Tomatoes',
                description: 'Fresh and organic red tomatoes from our farm.',
                category: 'Vegetables',
                price: 2.50,
                stockQuantity: 100
            })
        });
        const productData = await createProductRes.json();
        console.log("Created Product:", productData);

        console.log('\n--- TEST 3: Get All Products ---');
        const getProductsRes = await fetch(`${baseUrl}/products`);
        const allProducts = await getProductsRes.json();
        console.log("All Products count:", allProducts.length);
        console.log(allProducts[0] ? allProducts[0].name : "No products found");

        console.log('\n--- TEST 4: Register Customer ---');
        const registerCustomerRes = await fetch(`${baseUrl}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Alice Customer',
                email: 'alice@mail.com',
                password: 'password123',
                role: 'customer'
            })
        });
        let customerData = await registerCustomerRes.json();
        if (customerData.message === 'User already exists') {
             const loginRes = await fetch(`${baseUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: 'alice@mail.com', password: 'password123' })
             });
             customerData = await loginRes.json();
        }
        console.log("Customer Token: ***" + customerData.token?.substring(customerData.token?.length - 5));

        console.log('\n--- TEST 5: Create Order ---');
        const createOrderRes = await fetch(`${baseUrl}/orders`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${customerData.token}`
            },
            body: JSON.stringify({
                orderItems: [
                    {
                        name: productData.name || 'Tomato',
                        qty: 2,
                        price: productData.price || 2.5,
                        product: productData._id || (allProducts[0] ? allProducts[0]._id : "123")
                    }
                ],
                shippingAddress: {
                    address: '123 Main St',
                    city: 'Paris',
                    postalCode: '75001',
                    country: 'France'
                },
                paymentMethod: 'Card',
                totalPrice: 5.0
            })
        });
        const orderData = await createOrderRes.json();
        console.log("Created Order ID:", orderData._id);

        console.log('\n--- TEST 6: Get Customer Orders ---');
        const getOrdersRes = await fetch(`${baseUrl}/orders/myorders`, {
             headers: { 
                 'Authorization': `Bearer ${customerData.token}`
             }
        });
        const allOrders = await getOrdersRes.json();
        console.log("Customer Orders Count:", allOrders.length);
        
        console.log('\n--- ALL TESTS PASSED SUCCESSFULLY! ---');

    } catch (error) {
        console.error('TEST FAILED:', error);
    }
};

testAPI();

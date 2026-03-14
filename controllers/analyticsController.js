const Order = require('../models/Order');
const User = require('../models/User');
const Delivery = require('../models/Delivery');

const getDashboardStats = async (req, res) => {
    try {
        // 1. Total Distributions (kg) - Sum of qty in approved/delivered orders
        const orders = await Order.find({ status: { $in: ['approved', 'delivery', 'delivered'] } });
        let totalKg = 0;
        orders.forEach(order => {
            order.orderItems.forEach(item => {
                totalKg += item.qty;
            });
        });

        // 2. Approval Rate
        const totalOrdersCount = await Order.countDocuments();
        const approvedOrdersCount = await Order.countDocuments({ status: { $in: ['approved', 'delivery', 'delivered'] } });
        const approvalRate = totalOrdersCount > 0 ? (approvedOrdersCount / totalOrdersCount) * 100 : 0;

        // 3. Processing Time (avg in hours)
        const processedOrders = await Order.find({ status: { $in: ['approved', 'delivery', 'delivered'] } });
        let totalProcessingTime = 0;
        let countProcessed = 0;
        processedOrders.forEach(order => {
            const diff = (order.updatedAt - order.createdAt) / (1000 * 60 * 60); // in hours
            totalProcessingTime += diff;
            countProcessed++;
        });
        const avgProcessingTime = countProcessed > 0 ? (totalProcessingTime / countProcessed).toFixed(1) : 0;

        // 4. Active Farmers
        const activeFarmers = await User.countDocuments({ role: 'farmer', status: 'active' });

        // 5. Regional Performance
        // We'll group by user region
        const regionalStats = await Order.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'userData'
                }
            },
            { $unwind: '$userData' },
            {
                $group: {
                    _id: '$userData.region',
                    totalVolume: { 
                        $sum: { 
                            $reduce: {
                                input: '$orderItems',
                                initialValue: 0,
                                in: { $add: ['$$value', '$$this.qty'] }
                            }
                        } 
                    }
                }
            },
            { $sort: { totalVolume: -1 } }
        ]);

        // 6. Monthly Distributions (Simulate trend data for the chart)
        const monthlyData = await Order.aggregate([
            {
                $match: { status: { $in: ['approved', 'delivery', 'delivered'] } }
            },
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    total: { 
                        $sum: { 
                            $reduce: {
                                input: '$orderItems',
                                initialValue: 0,
                                in: { $add: ['$$value', '$$this.qty'] }
                            }
                        } 
                    }
                }
            },
            { $sort: { '_id': 1 } }
        ]);

        // 7. Recent Transactions (Live Distribution Stream)
        const recentTransactions = await Order.find({ status: { $in: ['approved', 'delivery', 'delivered'] } })
            .sort({ updatedAt: -1 })
            .limit(10)
            .populate('user', 'name');

        res.status(200).json({
            kpis: [
                { label: "Total Distributions", value: `${totalKg.toLocaleString()}`, sub: "kg total volume", trend: "+12%", positive: true },
                { label: "Approval Rate", value: `${approvalRate.toFixed(1)}%`, sub: "Avg conversion", trend: "+5%", positive: true },
                { label: "Processing Time", value: `${avgProcessingTime}h`, sub: "Target < 48h", trend: "-2h", positive: true },
                { label: "Active Farmers", value: `${activeFarmers}`, sub: "Registered", trend: "+12", positive: true },
            ],
            regionalPerformance: regionalStats.map(stat => ({
                name: stat._id || "Unknown",
                value: `${stat.totalVolume.toLocaleString()}kg`,
                pct: Math.min(100, (stat.totalVolume / (totalKg || 1)) * 100)
            })),
            monthlyTrend: Array.from({ length: 12 }, (_, i) => {
                const month = i + 1;
                const match = monthlyData.find(d => d._id === month);
                return match ? match.total : 0;
            }),
            recentTransactions: recentTransactions.map(tx => ({
                id: tx._id,
                farmer: tx.userData?.[0]?.name || tx.user?.name || 'Unknown',
                region: tx.userData?.[0]?.region || 'Dakar',
                amount: `${tx.orderItems.reduce((acc, item) => acc + item.qty, 0)}kg`,
                date: tx.updatedAt,
                status: tx.status
            }))
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const exportData = async (req, res) => {
    try {
        const orders = await Order.find({ status: { $in: ['approved', 'delivery', 'delivered'] } }).populate('user', 'name region');
        
        let csv = 'ID,Date,Farmer,Region,Amount(kg),Status\n';
        orders.forEach(order => {
            const amount = order.orderItems.reduce((acc, item) => acc + item.qty, 0);
            csv += `${order._id},${order.updatedAt.toISOString()},${order.user?.name || 'N/A'},${order.user?.region || 'Dakar'},${amount},${order.status}\n`;
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=distribution_report.csv');
        res.status(200).send(csv);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDashboardStats,
    exportData
};

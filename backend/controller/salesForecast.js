const salesModel = require('../models/salesModel');
const { spawn } = require('child_process');


const salesForecast = async (req, res) => {
    const { type } = req.params;

    try {
        const ownerId = req.user._id; // Assuming req.user is set by the authorization middleware
        const groupedData = await getTimeSeries(ownerId);
        console.log("Grouped Data:", groupedData);
        const results = [];

        for (const [productId, data] of Object.entries(groupedData)) {

            const forecast = await forecastProduct(data.sales);

            const days = type === 'next-week' ? 7 : 30;
            const totalForecast = forecast.slice(0, days).reduce((sum, day) => sum + Math.round(day.yhat), 0);

            results.push({
                productId,
                productName: data.productName,
                recommendedQty: totalForecast,
                for: type
            });
        }

        res.status(200).json({message: 'Forecasting successful', results});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Forecasting failed', error: err });
    }
};


// Helper: Aggregate product sales by day
async function getTimeSeries(ownerId) {

    console.log("Fetching sales data for owner:", ownerId);
    const result = await salesModel.aggregate([
        { $match: { associatedOwner: ownerId.toString() } },
        { $unwind: '$soldProducts' },
        {
            $addFields: {
                'soldProducts.quantity': {
                    $toInt: '$soldProducts.quantity'
                }
            }
        },
        {
            $group: {
                _id: {
                    productId: '$soldProducts.productId',
                    date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
                },
                productName: { $first: '$soldProducts.productName' },
                totalSold: { $sum: '$soldProducts.quantity'},
            }
        },
        { $sort: { '_id.date': 1 } }
    ]);

    // Group by productId
    const grouped = {};
    result.forEach(item => {
        const productId = item._id.productId;
        if (!grouped[productId]) grouped[productId] = { productName: item.productName, sales: [] };
        grouped[productId].sales.push({ date: item._id.date, totalSold: item.totalSold });
    });

    return grouped;
}


// Helper: Call Python forecasting
function forecastProduct(salesData) {
    return new Promise((resolve, reject) => {
        const py = spawn('python', ['forecast_model.py']);
        let output = '';

        py.stdout.on('data', (data) => { output += data.toString(); });
        py.stderr.on('data', (err) => { console.error(err.toString()); });
        py.on('close', () => {
            try {
                resolve(JSON.parse(output));
            } catch (e) {
                reject('Error parsing forecast output');
            }
        });

        py.stdin.write(JSON.stringify(salesData));
        py.stdin.end();
    });
}

module.exports = { salesForecast };
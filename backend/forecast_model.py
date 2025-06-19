# forecast_model.py
import pandas as pd
from prophet import Prophet
import sys, json

input_data = json.loads(sys.stdin.read())
df = pd.DataFrame(input_data)

df.rename(columns={"date": "ds", "totalSold": "y"}, inplace=True)
df['ds'] = pd.to_datetime(df['ds'])

if df.empty or df['y'].isnull().all() or len(df) < 2:
    print(json.dumps([]))
    sys.exit(0)

model = Prophet()
model.fit(df)

# Forecast 30 days
future = model.make_future_dataframe(periods=30)
forecast = model.predict(future)

# Return only forecasted values
result = forecast[['ds', 'yhat']].tail(30).to_dict(orient='records')

# 🛠 Convert Timestamp to string for JSON
for row in result:
    row['ds'] = row['ds'].strftime('%Y-%m-%d')

print(json.dumps(result))


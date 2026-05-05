const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Enable CORS for React frontend
app.use(cors({ origin: 'http://localhost:3000' }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define schema and model
const DataSchema = new mongoose.Schema({
  name: String,
  value: Number,
});
const Data = mongoose.model('Data', DataSchema);

// API route
app.get('/api/data', async (req, res) => {
  try {
    const data = await Data.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});import React, { useEffect, useState } from 'react';

function DataList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/data')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!data.length) return <div>No data found.</div>;

  return (
    <ul>
      {data.map((item) => (
        <li key={item._id}>
          {item.name}: {item.value}
        </li>
      ))}
    </ul>
  );
}

export default DataList;import React, { useEffect, useState } from 'react';

function DataList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/data')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!data.length) return <div>No data found.</div>;

  return (
    <ul>
      {data.map((item) => (
        <li key={item._id}>
          {item.name}: {item.value}
        </li>
      ))}
    </ul>
  );
}

export default DataList;
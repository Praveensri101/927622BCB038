const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 9876;

const BASE_URL = "http://localhost:9876/numbers";
const VALID_TYPES = ['p', 'f', 'e', 'r'];
const WINDOW_SIZE = 10;

let numberWindow = [];

app.get('/numbers/:numberid', async (req, res) => {
  const type = req.params.numberid;

  if (!VALID_TYPES.includes(type)) {
    return res.status(400).json({ error: "Invalid number type" });
  }

  let prevWindow = [...numberWindow];
  let newNumbers = [];

  try {
    const response = await Promise.race([
      axios.get(${BASE_URL}/${type}),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 500)
      )
    ]);

    if (response?.data?.numbers && Array.isArray(response.data.numbers)) {
      newNumbers = response.data.numbers;
      for (let num of newNumbers) {
        if (!numberWindow.includes(num)) {
          numberWindow.push(num);
          if (numberWindow.length > WINDOW_SIZE) {
            numberWindow.shift(); 
          }
        }
      }
    }

  } catch (err) {
    console.error("Error or timeout:", err.message);
  }

  let avg =
    numberWindow.length > 0
      ? (
          numberWindow.reduce((sum, num) => sum + num, 0) /
          numberWindow.length
        ).toFixed(2)
      : 0;

  res.json({
    numbers: newNumbers,
    windowPrevState: prevWindow,
    windowCurrState: numberWindow,
    avg: parseFloat(avg),
  });
});

app.listen(PORT, () => {
  console.log(Server running at http://localhost:${PORT});
});
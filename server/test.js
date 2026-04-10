const request = require('supertest');
const express = require('express');

const app = express();
app.get('/', (req, res) => {
  res.send('Hi');
});

test('GET / should return Hi', async () => {
  const res = await request(app).get('/');
  expect(res.text).toBe('Hi');
});
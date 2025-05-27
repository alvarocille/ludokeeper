import { describe, expect, test, vi } from "vitest"

const request = require('supertest')
const express = require('express')
const authRoutes = require('../src/routes/auth.routes')

const app = express()
app.use(express.json())
app.use('/auth', authRoutes)

describe('Auth Routes', () => {
  test('Registro con datos inválidos devuelve 400', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ username: 'u' }) // incompleto
    expect(res.status).toBe(400)
  })

  test('Login con campos vacíos devuelve 400', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({})
    expect(res.status).toBe(400)
  })
})

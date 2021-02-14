import { AlphaLocale } from 'express-validator/src/options'
import {MongoMemoryServer} from 'mongodb-memory-server'
import mongoose from 'mongoose'
import {app} from '../app'
import request from 'supertest'
import { response } from 'express'

declare global {
  namespace NodeJS {
    interface Global {
      signin(): Promise<string>
    }
  }
}

let mongo:any

beforeAll(async()=>{
  process.env.JWT_KEY='asdsd'
  mongo = new MongoMemoryServer()
  const mongoUri = await mongo.getUri()

  await mongoose.connect(mongoUri,{
    useNewUrlParser:true,
    useUnifiedTopology: true
  })

})

beforeEach(async ()=>{

  const collections=await mongoose.connection.db.collections()

  for (let collection of collections){
    await collection.deleteMany({})
  }
})

afterAll(async ()=>{
  await mongo.stop()
  await mongoose.connection.close()
})

global.signin=async()=>{
  const email='post@post.com'
  const password = 'password'
   await request(app)
  .post('/api/users/signup')
  .send(
    {email,password
  }).expect(400)

  const cookie=response.get('Set-Cookie')

  return cookie

}
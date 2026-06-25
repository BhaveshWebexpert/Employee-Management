import http from 'http'
import app from './index.js'
import mongoose from 'mongoose'
import env from './Config/EnvVar.js'

const server = http.createServer(app);
mongoose.connect(env.connectionURL).then(()=>console.log("DB connetcted")).catch(()=>console.log("DB Error"));

server.listen(env.port);
#!/bin/bash
redis-server &
mongod &
npm run start

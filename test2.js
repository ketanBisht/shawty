const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient({ log: ['info'] })
console.log('Success')


import express from 'express'
import cors from 'cors'
import pkg from './generated/prisma/index.js'

const { PrismaClient } = pkg
const prisma = new PrismaClient()

const app = express()

app.use(cors()) // O cors ele permite que qualquer porta possa acessar o nosso back and
app.use(express.json())

//  Rota raiz (para testar se o servidor está rodando)
app.get('/', (req, res) => {
  res.send('Servidor rodando com sucesso 🚀')
})


//  Buscar todos os usuários
app.get('/usuarios', async (req, res) => {
  try {
    const users = await prisma.user.findMany()
    res.status(200).json(users)
  } catch (error) {
    console.error('❌ Erro ao buscar usuários:', error)
    res.status(500).json({ error: error.message })
  }
})



//  Criar novo usuário
app.post('/usuarios', async (req, res) => {
  try {
    const novoUsuario = await prisma.user.create({
      data: {
        email: req.body.email,
        name: req.body.name,
        age: req.body.age,
      },
    })
    res.status(201).json(novoUsuario)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao criar usuário' })
  }
})


//  Atualizar usuário
app.put('/usuarios/:id', async (req, res) => {
  try {
    const usuarioAtualizado = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        email: req.body.email,
        name: req.body.name,
        age: req.body.age,
      },
    })
    res.status(200).json(usuarioAtualizado)
  } catch (error) {
    console.error('Erro no PUT /usuarios/:id:', error)
    res.status(500).json({ error: error.message })
  }
})


// ✅ Deletar usuário
app.delete('/usuarios/:id', async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: req.params.id },
    })
    res.status(200).json({ message: 'Usuário deletado com sucesso!' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao deletar usuário' })
  }
})


// ✅ Inicializar servidor
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000 🚀')
})

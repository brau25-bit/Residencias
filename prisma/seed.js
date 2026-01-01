import prisma from '../src/db/client.js'
import bcrypt from 'bcrypt'

// ------------------ HELPERS ------------------
const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)]

const randomDateBetween = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  )
}

// ------------------ DATA ------------------
const categories = [
  'ROAD_ISSUE',
  'GRAFFITI',
  'ILLEGAL_DUMPING',
  'STREET_LIGHT_ISSUE',
  'OTHER'
]

const statuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']

// Coordenadas realistas (CDMX zona centro)
const baseLat = 19.4326
const baseLng = -99.1332

// ------------------ SEED ------------------
async function main() {
  console.log('🌱 Iniciando seed...')

  // Hash de contraseña genérica
  const defaultPassword = await bcrypt.hash('password123', 10)

  // 🧑‍💼 ADMIN
  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      lastname: 'Sistema',
      email: 'admin@test.com',
      password: defaultPassword,
      role: 'ADMIN',
      verified: true,
      canReport: true
    }
  })
  console.log('✅ Admin creado')

  // 🧑‍🔧 TECHNICIANS
  const technicians = []
  for (let i = 1; i <= 3; i++) {
    technicians.push(
      await prisma.user.create({
        data: {
          name: `Técnico`,
          lastname: `${i}`,
          email: `tech${i}@test.com`,
          password: defaultPassword,
          role: 'TECHNICIAN',
          verified: true,
          canReport: false
        }
      })
    )
  }
  console.log(`✅ ${technicians.length} técnicos creados`)

  // 👤 USERS
  const users = []
  for (let i = 1; i <= 10; i++) {
    users.push(
      await prisma.user.create({
        data: {
          name: `Usuario`,
          lastname: `${i}`,
          email: `user${i}@test.com`,
          password: defaultPassword,
          role: 'USER',
          verified: true,
          canReport: true
        }
      })
    )
  }
  console.log(`✅ ${users.length} usuarios creados`)

  // 📝 REPORTS CON HISTORIAL
  const startDate = new Date('2025-01-01')
  const endDate = new Date()

  for (let i = 0; i < 120; i++) {
    const user = randomFrom(users)
    const createdAt = randomDateBetween(startDate, endDate)

    // Crear reporte inicial (siempre PENDING)
    const report = await prisma.report.create({
      data: {
        title: `Reporte ${i + 1}`,
        description: `Descripción detallada del reporte ${i + 1} para pruebas de analytics`,
        category: randomFrom(categories),
        status: 'PENDING',
        latitude: baseLat + (Math.random() - 0.5) * 0.1,
        longitude: baseLng + (Math.random() - 0.5) * 0.1,
        userId: user.id,
        createdAt,
        updatedAt: createdAt
      }
    })

    // 🔄 SIMULACIÓN DE CAMBIOS DE ESTADO
    let currentStatus = 'PENDING'
    let historyDate = new Date(createdAt.getTime() + 1000 * 60 * 60 * 2) // +2 horas

    // 70% pasan a IN_PROGRESS
    if (Math.random() > 0.3) {
      const technician = randomFrom(technicians)
      
      await prisma.reportStatusHistory.create({
        data: {
          reportId: report.id,
          oldStatus: currentStatus,
          newStatus: 'IN_PROGRESS',
          changedById: technician.id,
          changedAt: historyDate
        }
      })

      currentStatus = 'IN_PROGRESS'
      historyDate = new Date(historyDate.getTime() + 1000 * 60 * 60 * 48) // +48 horas

      // 80% de los IN_PROGRESS se completan
      if (Math.random() > 0.2) {
        await prisma.reportStatusHistory.create({
          data: {
            reportId: report.id,
            oldStatus: currentStatus,
            newStatus: 'COMPLETED',
            changedById: technician.id,
            changedAt: historyDate
          }
        })

        currentStatus = 'COMPLETED'
      } else {
        // 20% se cancelan
        await prisma.reportStatusHistory.create({
          data: {
            reportId: report.id,
            oldStatus: currentStatus,
            newStatus: 'CANCELLED',
            changedById: admin.id,
            changedAt: historyDate
          }
        })

        currentStatus = 'CANCELLED'
      }
    } else {
      // 30% se cancelan directamente desde PENDING
      await prisma.reportStatusHistory.create({
        data: {
          reportId: report.id,
          oldStatus: 'PENDING',
          newStatus: 'CANCELLED',
          changedById: admin.id,
          changedAt: historyDate
        }
      })

      currentStatus = 'CANCELLED'
    }

    // Actualizar el estado final del reporte
    await prisma.report.update({
      where: { id: report.id },
      data: { 
        status: currentStatus,
        updatedAt: historyDate
      }
    })

    if ((i + 1) % 20 === 0) {
      console.log(`📊 ${i + 1}/120 reportes creados...`)
    }
  }

  console.log('✅ Seed completado exitosamente')
  console.log('\n📈 Resumen:')
  console.log(`- 1 Admin`)
  console.log(`- 3 Técnicos`)
  console.log(`- 10 Usuarios`)
  console.log(`- 120 Reportes con historial`)
  console.log('\n🔐 Credenciales de prueba:')
  console.log(`Email: admin@test.com / user1@test.com / tech1@test.com`)
  console.log(`Password: password123`)
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
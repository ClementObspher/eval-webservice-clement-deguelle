import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import * as fs from 'fs'
import * as express from 'express'
import { join } from 'path'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // Retire les propriétés qui ne sont pas dans le DTO
            forbidNonWhitelisted: true, // Erreur si une propriété en trop est envoyée
            transform: true, // Transforme les payloads en types des DTO
        }),
    )

    const config = new DocumentBuilder()
        .setTitle('Booking Platform')
        .setOpenAPIVersion('3.0.0')
        .setDescription('API REST de réservation de salles')
        .setVersion('1.0')
        .addBearerAuth()
        .addServer('http://localhost:3000')
        .build()

    const document = SwaggerModule.createDocument(app, config, {
        autoTagControllers: true,
    })
    fs.writeFileSync('swagger.json', JSON.stringify(document, null, 2))
    SwaggerModule.setup('docs', app, document)

    app.use('/public', express.static(join(__dirname, '..', 'public')))

    await app.listen(3000)
}
bootstrap()

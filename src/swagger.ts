import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {INestApplication} from '@nestjs/common/interfaces/nest-application.interface';

export class Swagger {
    private static options;
    private static document;

    /**
     * Swagger configuration
     */
    public static configure() {
        Swagger.options = new DocumentBuilder()
            .setSchemes('http', 'https')
            .setTitle('CBA Risk Management Tools (CRMT) APIs')
            .setDescription('These are APIs documentation for CRMT')
            .setVersion('1.0.0')
            .addTag('auth', 'This is used to authenticate a user')
            .addTag('users', 'These are apis pertaining to users')
            .addTag('services', 'These are apis pertaining to general services')
            .build();
    }

    /**
     * Swagger setup initialization
     * @param {INestApplication} app
     */
    public static setup(app: INestApplication) {
        Swagger.document = SwaggerModule.createDocument(app, Swagger.options);
        SwaggerModule.setup('/', app, Swagger.document);
    }
}
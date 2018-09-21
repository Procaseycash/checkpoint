import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {INestApplication} from '@nestjs/common/interfaces/nest-application.interface';
import {API_VERSION} from 'config/app.config';

export class Swagger {
    private static options;
    private static document;

    /**
     * Swagger configuration
     */
    public static configure() {
        Swagger.options = new DocumentBuilder()
            .setSchemes('http', 'https')
            .setTitle('Check In  APIs')
            .setDescription('These are APIs documentation for Check In App')
            .setVersion('1.0.0')
            .setBasePath('/' + API_VERSION)
            .addOAuth2('implicit', '/' + API_VERSION + '/auth/token')
            .setContactEmail('kezyolanipekun@gmail.com')
            .addTag('auth', 'This is used to authenticate a user')
            .addTag('users', 'These are APIs pertaining to users')
            .addTag('services', 'These are APIs pertaining to general services')
            .build();
    }

    /**
     * Swagger setup initialization
     * @param {INestApplication} app
     */
    public static setup(app: INestApplication) {
        Swagger.document = SwaggerModule.createDocument(app, Swagger.options);
        SwaggerModule.setup('/api', app, Swagger.document);
    }
}
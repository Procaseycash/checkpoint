import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {INestApplication} from '@nestjs/common/interfaces/nest-application.interface';
import {API_VERSION} from './config/app.config';

export class Swagger {
    private static options;
    private static document;

    /**
     * Swagger configuration
     */
    public static configure() {
        Swagger.options = new DocumentBuilder()
            .setSchemes('http', 'https')
            .setTitle('CheckPoint App  APIs')
            .setDescription('These are APIs documentation for CheckPoint App')
            .setVersion('1.0.0')
            .setBasePath('/' + API_VERSION)
            .addOAuth2('implicit', '/' + API_VERSION + '/auth/token')
            .setContactEmail('kezyolanipekun@gmail.com')
            .addTag('auth', 'This is used to authenticate a user and get user tokens for different account at ago for purpose of testing API and login')
            .addTag('consumers', 'These are APIs belonging to a user that can check in to a location')
            .addTag('merchants', 'These are APIs belonging to Merchant that have integrated to CheckPoint App for customer point payments')
            .addTag('users', 'These are APIs pertaining to general user accounts be it consumers, mrchants or drivers')
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
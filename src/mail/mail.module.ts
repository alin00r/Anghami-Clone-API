import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
import { join } from 'node:path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          transport: {
            pool: true,
            service: 'gmail',
            auth: {
              user: config.get<string>('GMAIL_USER'),
              pass: config.get<string>('GMAIL_PASS'),
            },
          },
          defaults: {
            from: `"No Reply" <${config.get<string>('GMAIL_USER')}>`,
            headers: {
              'X-MS-Exchange-CrossTenant-AuthAs': 'Internal',
              'X-MS-Exchange-CrossTenant-AuthSource': 'your-azure-server.com',
              'X-MS-Exchange-CrossTenant-FromEntityHeader': 'Internet',

              'X-Mailer': 'NestJS Mailer',
              'Reply-To': 'support@yourdomain.com', // Optional
            },
          },

          template: {
            dir: join(__dirname, 'templates'),
            adapter: new EjsAdapter({
              inlineCssEnabled: true,
            }),
          },
          options: {
            strict: true,
          },
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}

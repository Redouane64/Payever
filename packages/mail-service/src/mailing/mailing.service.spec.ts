import { Test, TestingModule } from '@nestjs/testing';
import { MailingService } from './mailing.service';
import { faker } from '@faker-js/faker';

describe('MailingService', () => {
  let service: MailingService;

  const fakeMailingService = {
    sendMail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailingService,
        { provide: 'MailingService', useValue: fakeMailingService },
      ],
    }).compile();

    service = module.get<MailingService>(MailingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call send email', async () => {
    const options = {
      to: faker.internet.email(),
      subject: faker.lorem.text(),
      html: faker.lorem.paragraph(2),
      encoding: 'utf-8',
    };

    await service.send(options);

    expect(fakeMailingService.sendMail).toHaveBeenCalledWith(options);
  });
});

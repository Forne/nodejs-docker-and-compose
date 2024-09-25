import { TypeOrmModule } from '@nestjs/typeorm';

export const TypeORMMySqlTestingModule = (entities: any[]) =>
  TypeOrmModule.forRoot({
    url: 'postgres://localhost:5432/kupipodariday_test',
    entities: [...entities],
    synchronize: true,
  });

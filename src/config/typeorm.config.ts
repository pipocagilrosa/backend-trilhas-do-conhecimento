import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import { migrations } from '../migrations';

export const getDatabaseDataSourceOptions = ({
  port,
  host,
  username,
  database,
  schema,
  password,
}): DataSourceOptions => {
  return {
    type: 'postgres',
    port,
    host,
    username,
    database,
    schema,
    password: password,
    entities: [join(__dirname, '../', '**', '*.entity.{ts,js}')],
    migrations,
    migrationsTableName: 'migrations',
  };
};

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 54244,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [join(__dirname, '../', '**', '*.entity.{ts,js}')],
  // NUNCA ligar synchronize. Ele alinha o banco com as entidades do build que
  // estiver rodando: se um pod subir com uma imagem antiga, o TypeORM apaga as
  // colunas que aquela imagem não conhece (foi assim que "favorite" sumia a
  // cada restart). Mudanca de schema so entra por migration.
  synchronize: false,
  // Aplica as migrations pendentes no boot, entao qualquer pod que suba deixa
  // o schema no estado correto sem intervencao manual.
  migrations,
  migrationsRun: true,
  migrationsTableName: 'migrations',
};

// This is used by TypeORM migration scripts
export const DatabaseSource = new DataSource({
  ...getDatabaseDataSourceOptions(typeOrmConfig as any),
});

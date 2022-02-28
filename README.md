# winston-prisma-transporter

Prisma transport for [winston@3.x](https://github.com/winstonjs/winston) logger


### Installation

base dependencies:
```bash
npm install --save winston-prisma-transporter
# OR
pnpm add winston-prisma-transporter  
```

peer dependencies:
```bash
npm install --save winston @prisma/client
# OR
pnpm add winston @prisma/client
```

### Usage

Create models:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model UserLog {
  id        Int      @id @default(autoincrement()) @db.UnsignedInt
  timestamp DateTime @default(now()) @db.Timestamp(0)
  level     String   @db.Text
  message   String   @db.Text
  meta      Json?
}
```

Run your prisma migrations and you're ready to go!

Setup with default configs:
```typescript
import { createLogger, format } from "winston";
import { PrismaClient } from "@prisma/client";
import { PrismaWinstonTransporter } from "winston-prisma-transporter";

const prisma = new PrismaClient();   
const logger = winston.createLogger({
  transports: [
    format: format.json(),
    new PrismaWinstonTransporter({
      level: "http",
      prisma
    }),
  ],
});
```

#### Customizations
Out of the box, the logger will log all levels to the Table called `UserLog`. That can be changed to a different table by passing in the custom table name.

```typescript
import { createLogger, format } from "winston";
import { PrismaClient } from "@prisma/client";
import { PrismaWinstonTransporter } from "winston-prisma-transporter";

const prisma = new PrismaClient();   
const logger = winston.createLogger({
  transports: [
    format: format.json(),
    new PrismaWinstonTransporter({
      level: "http",
      prisma,
      tableName: "CustomTableName"
    }),
  ],
});
```

All options avaliable while initiating the transport:
```typescript
export interface PrismaTransporterOptions extends TransportStreamOptions {
  prisma: PrismaClient;
  tableName?: string;
}
```

### ToDos:
- [ ] Add tests
- [ ] Add eslint support
- [ ] Add ci/cd for tests
- [ ] Add ci/cd for code qul     check


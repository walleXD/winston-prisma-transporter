// @ts-expect-error type properly created in prod
import type { PrismaClient } from "@prisma/client";
import Transport, { type TransportStreamOptions } from "winston-transport";

export interface PrismaTransporterOptions extends TransportStreamOptions {
  prisma: PrismaClient;
  tableName?: string;
}

export interface ILogInfo {
  level: string;
  message: string;
  meta?: Record<string, unknown>;
}

/**
 * @constructor
 * @param {Object} options Options for the Prisma & log plugin
 * @param {String} options.prisma Prisma client
 * @param {Object} **Optional** options.fields Log object, set custom fields for the log table
 * @param {String} **Optional** options.tableName Name of the table to log to
 * @param {Function} **Optional** options.log Custom log function
 * 
 * @returns {Object} Winston transport
 * 
 * Create Primsa Transport plugin for Winston
 */
export class PrismaWinstonTransporter extends Transport {
  private prisma: PrismaClient;
  private tableName: string;

  constructor(options: PrismaTransporterOptions) {
    super(options);

    this.prisma = options.prisma;
    this.tableName = options.tableName ?? "userLog";
  }

  /**
   * function log (info, callback)
   * {level, msg, meta} = info
   * @level {string} Level at which to log the message.
   * @msg {string} Message to log
   * @meta {Object} **Optional** Additional metadata to attach
   * @callback {function} Continuation to respond to when complete.
   * 
   * @returns {undefined}
   * 
   * Core logging method exposed to Winston. Metadata is optional.
   */
  log(
    info: ILogInfo,
    callback?: (error?: Error, value?: unknown) => void
  ): void {

    // get log content
    const { level, message, meta } = info;

    process.nextTick(() => {
      // protect
      if (!callback) {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        callback = () => {};
      }

      this.prisma[this.tableName]
        .create({
          data: {
            level,
            message,
            timestamp: new Date(),
            meta,
          },
        })
        .then(() => {
          setImmediate(() => {
            this.emit("logged", info);
          });

          return callback && callback(undefined, true);
        })
        .catch((err: Error) => {
          setImmediate(() => {
            this.emit("error", err);
          });

          return callback && callback(err, null);
        });
    });
  }
}

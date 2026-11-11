import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import { Inject, Injectable } from '@nestjs/common';
import { ENV } from '../config/config.module.js';
import type { Env } from '../config/env.js';

/** Secreto cifrado: los datos con una llave propia, y esa llave cifrada con la llave maestra. */
export interface EncryptedSecret {
  v: 1;
  /** Llave de datos cifrada con la llave maestra: iv(12) + tag(16) + ciphertext, en base64. */
  key: string;
  /** Secreto cifrado con la llave de datos: iv(12) + tag(16) + ciphertext, en base64. */
  data: string;
}

const ALGORITHM = 'aes-256-gcm';

/**
 * Cifrado envolvente de credenciales de clientes (ADR-009, D-12): cada secreto tiene su propia llave
 * de datos AES-256-GCM, y esa llave se cifra con CREDENTIALS_MASTER_KEY. Rotar la maestra solo exige
 * volver a cifrar las llaves de datos, no los secretos.
 */
@Injectable()
export class CredentialsCipher {
  private readonly masterKey: Buffer;

  constructor(@Inject(ENV) env: Pick<Env, 'CREDENTIALS_MASTER_KEY'>) {
    this.masterKey = Buffer.from(env.CREDENTIALS_MASTER_KEY, 'base64');
  }

  encrypt(secret: string): EncryptedSecret {
    const dataKey = randomBytes(32);
    try {
      return {
        v: 1,
        key: seal(this.masterKey, dataKey).toString('base64'),
        data: seal(dataKey, Buffer.from(secret, 'utf8')).toString('base64'),
      };
    } finally {
      dataKey.fill(0);
    }
  }

  decrypt(secret: EncryptedSecret): string {
    const dataKey = open(this.masterKey, Buffer.from(secret.key, 'base64'));
    try {
      return open(dataKey, Buffer.from(secret.data, 'base64')).toString('utf8');
    } finally {
      dataKey.fill(0);
    }
  }
}

function seal(key: Buffer, plaintext: Buffer): Buffer {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), ciphertext]);
}

function open(key: Buffer, sealed: Buffer): Buffer {
  const decipher = createDecipheriv(ALGORITHM, key, sealed.subarray(0, 12));
  decipher.setAuthTag(sealed.subarray(12, 28));
  return Buffer.concat([decipher.update(sealed.subarray(28)), decipher.final()]);
}

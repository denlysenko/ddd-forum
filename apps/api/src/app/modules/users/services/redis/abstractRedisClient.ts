/* eslint-disable @typescript-eslint/no-explicit-any */
import type { createClient } from 'redis';

export abstract class AbstractRedisClient {
  #tokenExpiryTime = 604800;
  protected client: ReturnType<typeof createClient>;

  constructor(client: ReturnType<typeof createClient>) {
    this.client = client;
  }

  async count(key: string): Promise<number> {
    const allKeys = await this.getAllKeys(key);
    return allKeys.length;
  }

  async exists(key: string): Promise<boolean> {
    const count = await this.count(key);
    return count >= 1;
  }

  getOne<T>(key: string): Promise<T> {
    return this.client.get(key) as Promise<T>;
  }

  getAllKeys(wildcard: string): Promise<string[]> {
    return this.client.keys(wildcard);
  }

  async getAllKeyValue(wildcard: string): Promise<any[]> {
    const results = await this.getAllKeys(wildcard);
    return Promise.all(
      results.map(async (key) => {
        const value = await this.getOne(key);
        return { key, value };
      })
    );
  }

  set(key: string, value: any): Promise<any> {
    return this.client.set(key, value, { EX: this.#tokenExpiryTime });
  }

  deleteOne(key: string): Promise<number> {
    return this.client.del(key);
  }

  async testConnection(): Promise<any> {
    await this.client.set('test', 'connected');
    return true;
  }
}

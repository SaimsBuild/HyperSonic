import { type PushSubscription, type InsertPushSubscription } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getAllSubscriptions(): Promise<PushSubscription[]>;
  getSubscription(endpoint: string): Promise<PushSubscription | undefined>;
  createSubscription(subscription: InsertPushSubscription): Promise<PushSubscription>;
  deleteSubscription(endpoint: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private subscriptions: Map<string, PushSubscription>;

  constructor() {
    this.subscriptions = new Map();
  }

  async getAllSubscriptions(): Promise<PushSubscription[]> {
    return Array.from(this.subscriptions.values());
  }

  async getSubscription(endpoint: string): Promise<PushSubscription | undefined> {
    return this.subscriptions.get(endpoint);
  }

  async createSubscription(insertSubscription: InsertPushSubscription): Promise<PushSubscription> {
    const existing = this.subscriptions.get(insertSubscription.endpoint);
    if (existing) {
      return existing;
    }

    const id = randomUUID();
    const subscription: PushSubscription = {
      ...insertSubscription,
      id,
      createdAt: new Date().toISOString(),
    };
    this.subscriptions.set(insertSubscription.endpoint, subscription);
    return subscription;
  }

  async deleteSubscription(endpoint: string): Promise<boolean> {
    return this.subscriptions.delete(endpoint);
  }
}

export const storage = new MemStorage();

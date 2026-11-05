import { configDefaults } from "@defaults";
import { ConfigModel } from "@models";
import { getConfigs } from "@services";
import { Types } from "mongoose";

export class ConfigManager {
  private static instance: ConfigManager;
  private config: ConfigModel = {
    _id: new Types.ObjectId(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...configDefaults
  };
  private observers: Set<(config: ConfigModel) => void> = new Set();

  private constructor() {
    this.updateConfig();
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  public getConfig(): ConfigModel {
    return this.config;
  }

  public async updateConfig(): Promise<void> {
    const refreshedConfigs = await getConfigs();
    this.config = refreshedConfigs!;
    this.notifyObservers();
  }

  public registerObserver(observer: (config: ConfigModel) => void): void {
    this.observers.add(observer);
  }

  public unregisterObserver(observer: (config: ConfigModel) => void): void {
    this.observers.delete(observer);
  }

  private notifyObservers(): void {
    this.observers.forEach((observer) => observer(this.config));
  }
}

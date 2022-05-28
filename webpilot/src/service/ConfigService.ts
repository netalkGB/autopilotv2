export interface ConfigService {
  getConfigValue(key: string): Promise<string | undefined>

  setConfig(key: string, value: string): Promise<void>
}

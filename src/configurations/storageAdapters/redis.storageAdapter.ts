import { StorageAdapter } from "../../types/configuration.types";

export default function getRedisStorageAdapter(options: {}): StorageAdapter {
  // TODO Complete
  return {
    async get(key: string) {
      return ''
    },
    async set(key: string, value: string) {
      return
    },
    async delete(key: string) {
      return
    }
  }
}
import {
  PodServerConfiguration,
  PodServerInternalConfiguration,
  NetworkConfiguration,
  NetworkInternalConfiguration
} from "../../types/configuration.types";
import validateSchema from "../../util/validateSchema";
import defaultConfiguration from "./defaultConfiguration";
import applyStorageAdapterDefaults from "./storageAdapters/applyStorageAdapterDefaults";
import applyHTMLRendererDefaults from "./htmlRenderers/applyHTMLRendererDefaults";
import applyAdditionalRoutesDefaults from './additionalRoutes/applyAdditionalRoutesDefaults'

/*
 * Schemas
 */

export const newtworkConfigurationSchema = {
  title: 'Network Configuration',
  type: 'object',
  properties: {
    hostname: {
      type: 'string',
      format: 'hostname',
      default: defaultConfiguration.network.hostname
    },
    port: {
      type: 'integer',
      default: defaultConfiguration.network.port
    },
    protocol: {
      type: 'string',
      enum: [ 'http', 'https' ],
      default: defaultConfiguration.network.protocol
    },
    ssl: {
      type: 'object',
      properties: {
        cert: { type: 'string' },
        key: { type: 'string' }
      },
      default: defaultConfiguration.network.ssl
    }
  }
}

/*
 * Retrieve based on configs
 */

export function applyNetworkConfigurationDefaults(networkConfig?: NetworkConfiguration): NetworkInternalConfiguration {
  if (!networkConfig) {
    return applyNetworkConfigurationDefaults(defaultConfiguration.network)
  }
  validateSchema(newtworkConfigurationSchema, networkConfig)
  return {
    ...networkConfig,
    url: new URL(`${networkConfig.protocol}://${networkConfig.hostname}:${networkConfig.port}`)
  } as NetworkInternalConfiguration
}

/*
 * Apply Configuration Defaults
 */

export default function applyPodServerConfigurationDefaults(config: PodServerConfiguration, fileLocation: string): PodServerInternalConfiguration {
  return {
    storage: applyStorageAdapterDefaults(config.storage),
    network: applyNetworkConfigurationDefaults(config.network),
    htmlRenderer: applyHTMLRendererDefaults(config.htmlRenderer),
    additionalRoutes: applyAdditionalRoutesDefaults(config.additionalRoutes),
    relativeConfigFilepath: fileLocation
  }
}
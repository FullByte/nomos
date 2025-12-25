import {
  NamingConfig,
  GenerateNameRequest,
  GenerateNameResponse,
  ValidateNameRequest,
  ValidateNameResponse,
  NamingComponent,
  ResourceType,
  CloudProvider
} from '../../../shared/types.js';
import { BestPracticesService } from './bestPractices.js';
import { NameRecordModel } from '../models/nameRecord.js';

export class NamingEngine {
  static generateName(config: NamingConfig, components: Record<string, string>): string {
    let name = '';

    // Präfix hinzufügen
    if (config.prefix) {
      name += config.prefix + config.separator;
    }

    // Komponenten in der konfigurierten Reihenfolge hinzufügen
    for (const component of config.components) {
      if (components[component.name]) {
        let value = components[component.name];
        
        // Maximale Länge prüfen
        if (component.maxLength && value.length > component.maxLength) {
          value = value.substring(0, component.maxLength);
        }

        // Erlaubte Zeichen prüfen und filtern
        if (component.allowedChars) {
          const regex = new RegExp(`[^${component.allowedChars}]`, 'gi');
          value = value.replace(regex, '');
        }

        if (name && !name.endsWith(config.separator)) {
          name += config.separator;
        }
        name += value;
      }
    }

    // Suffix hinzufügen
    if (config.suffix) {
      if (!name.endsWith(config.separator)) {
        name += config.separator;
      }
      name += config.suffix;
    }

    // Groß-/Kleinschreibung anwenden
    name = this.applyCaseStyle(name, config.caseStyle);

    // Maximale Gesamtlänge prüfen
    if (config.maxTotalLength && name.length > config.maxTotalLength) {
      name = name.substring(0, config.maxTotalLength);
    }

    return name;
  }

  static applyCaseStyle(name: string, caseStyle: string): string {
    switch (caseStyle) {
      case 'lowercase':
        return name.toLowerCase();
      case 'uppercase':
        return name.toUpperCase();
      case 'camelCase':
        return this.toCamelCase(name);
      case 'PascalCase':
        return this.toPascalCase(name);
      case 'kebab-case':
        return name.toLowerCase().replace(/\s+/g, '-');
      default:
        return name.toLowerCase();
    }
  }

  static toCamelCase(str: string): string {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
  }

  static toPascalCase(str: string): string {
    const camel = this.toCamelCase(str);
    return camel.charAt(0).toUpperCase() + camel.slice(1);
  }

  static async generateNames(request: GenerateNameRequest): Promise<GenerateNameResponse> {
    const warnings: string[] = [];

    // Best Practice abrufen
    let bestPractice = null;
    if (request.cloudProvider) {
      bestPractice = await BestPracticesService.getBestPractice(
        request.cloudProvider,
        request.resourceType
      );
    }

    // Konfiguration erstellen oder laden
    let config: NamingConfig;
    if (request.customConfig) {
      config = this.mergeConfigWithBestPractice(request.customConfig, bestPractice, request.resourceType);
    } else {
      // Standard-Konfiguration basierend auf Best Practice
      config = this.createConfigFromBestPractice(bestPractice, request.resourceType, request.cloudProvider);
    }

    // Namen generieren
    const names: string[] = [];
    const baseName = this.generateName(config, request.components);

    // Mehrere Varianten generieren (mit unterschiedlichen Instanznummern)
    for (let i = 1; i <= 5; i++) {
      const instanceComponents = { ...request.components, instance: String(i).padStart(2, '0') };
      const name = this.generateName(config, instanceComponents);
      
      // Duplikat-Prüfung
      const existing = await NameRecordModel.findByName(name);
      if (!existing) {
        names.push(name);
      } else {
        warnings.push(`Name "${name}" existiert bereits`);
      }
    }

    // Wenn keine Namen generiert werden konnten, trotzdem Basis-Name zurückgeben
    if (names.length === 0) {
      names.push(baseName);
      warnings.push('Alle generierten Namen existieren bereits in der Datenbank');
    }

    return {
      names,
      config,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }

  static async validateName(request: ValidateNameRequest): Promise<ValidateNameResponse> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Best Practice abrufen
    let bestPractice = null;
    if (request.cloudProvider) {
      bestPractice = await BestPracticesService.getBestPractice(
        request.cloudProvider,
        request.resourceType
      );
    }

    // Validierung gegen Best Practice
    if (bestPractice) {
      // Länge prüfen
      if (request.name.length > bestPractice.maxLength) {
        errors.push(`Name überschreitet maximale Länge von ${bestPractice.maxLength} Zeichen`);
      }

      // Erlaubte Zeichen prüfen
      const allowedRegex = new RegExp(`^[${bestPractice.allowedChars}]+$`, 'i');
      if (!allowedRegex.test(request.name)) {
        errors.push(`Name enthält nicht erlaubte Zeichen. Erlaubt: ${bestPractice.allowedChars}`);
      }

      // Groß-/Kleinschreibung prüfen
      if (bestPractice.caseStyle === 'lowercase' && request.name !== request.name.toLowerCase()) {
        warnings.push('Name sollte in Kleinbuchstaben sein');
      }
    }

    // Duplikat-Prüfung
    const existing = await NameRecordModel.findByName(request.name);
    if (existing) {
      errors.push('Name existiert bereits in der Datenbank');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      isDuplicate: !!existing
    };
  }

  static createConfigFromBestPractice(
    bestPractice: any,
    resourceType: ResourceType,
    cloudProvider?: CloudProvider
  ): NamingConfig {
    if (!bestPractice) {
      // Standard-Konfiguration wenn keine Best Practice vorhanden
      return {
        name: 'Standard',
        resourceType,
        cloudProvider,
        components: [
          { name: 'env', value: '', required: true },
          { name: 'resource', value: '', required: true },
          { name: 'instance', value: '', required: false }
        ],
        separator: '-',
        caseStyle: 'lowercase',
        maxTotalLength: 63
      };
    }

    const components: NamingComponent[] = bestPractice.recommendedComponents.map((comp: string) => ({
      name: comp,
      value: '',
      required: comp === 'env' || comp === 'resource'
    }));

    return {
      name: `${bestPractice.provider} ${bestPractice.resourceType} Standard`,
      resourceType,
      cloudProvider: bestPractice.provider,
      components,
      separator: bestPractice.separator,
      caseStyle: bestPractice.caseStyle,
      maxTotalLength: bestPractice.maxLength
    };
  }

  static mergeConfigWithBestPractice(
    customConfig: Partial<NamingConfig>,
    bestPractice: any,
    resourceType: ResourceType
  ): NamingConfig {
    const baseConfig = this.createConfigFromBestPractice(bestPractice, resourceType, customConfig.cloudProvider);
    
    return {
      ...baseConfig,
      ...customConfig,
      resourceType,
      components: customConfig.components || baseConfig.components,
      separator: customConfig.separator || baseConfig.separator,
      caseStyle: customConfig.caseStyle || baseConfig.caseStyle
    } as NamingConfig;
  }
}


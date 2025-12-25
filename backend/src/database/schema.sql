-- Bereits genutzte Namen
CREATE TABLE IF NOT EXISTS used_names (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    resource_type TEXT NOT NULL,
    environment TEXT,
    cloud_provider TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Naming-Konfigurationen
CREATE TABLE IF NOT EXISTS naming_configs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    cloud_provider TEXT,
    environment TEXT,
    config_json TEXT NOT NULL,
    is_default BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Best Practices Referenzen
CREATE TABLE IF NOT EXISTS best_practices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    provider TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    rules_json TEXT NOT NULL,
    examples TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(provider, resource_type)
);

-- API Keys
CREATE TABLE IF NOT EXISTS api_keys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key_hash TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_used_at DATETIME,
    is_active BOOLEAN DEFAULT 1
);

-- Indizes für bessere Performance
CREATE INDEX IF NOT EXISTS idx_used_names_resource_type ON used_names(resource_type);
CREATE INDEX IF NOT EXISTS idx_used_names_cloud_provider ON used_names(cloud_provider);
CREATE INDEX IF NOT EXISTS idx_used_names_environment ON used_names(environment);
CREATE INDEX IF NOT EXISTS idx_naming_configs_resource_type ON naming_configs(resource_type);
CREATE INDEX IF NOT EXISTS idx_naming_configs_cloud_provider ON naming_configs(cloud_provider);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_is_active ON api_keys(is_active);


/** Shape of the e2e key in a package.json. */
export interface PackageE2eConfig {
  services: string[];
  baseURL?: string;
}

/** Shape of a package.json with optional e2e key. */
export interface PackageJson {
  name?: string;
  e2e?: PackageE2eConfig;
}

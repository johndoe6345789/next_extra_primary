-- 004_repo_type_install.sql
-- Add install instructions template to repo_types.
-- Supports {ns}, {name}, {version}, {variant} placeholders.

ALTER TABLE repo_types
    ADD COLUMN IF NOT EXISTS label   TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS color   TEXT NOT NULL DEFAULT '#757575',
    ADD COLUMN IF NOT EXISTS install TEXT NOT NULL DEFAULT '';

-- Seed built-in repo types with install instructions.
INSERT INTO repo_types (name, label, description, color, install)
VALUES
  ('deb', 'deb/apt', 'Debian/Ubuntu .deb packages', '#A80030',
   E'deb http://localhost:5050/apt {ns} main\napt update && apt install {name}={version}'),
  ('npm', 'npm', 'Node.js packages', '#CB3837',
   E'npm install {name}@{version} --registry http://localhost:5050/npm/'),
  ('conan', 'conan', 'C/C++ Conan v2 packages', '#6699CB',
   E'conan remote add nextra http://localhost:5050/conan\nconan install --requires={name}/{version}'),
  ('pypi', 'pypi', 'Python wheels/sdists', '#3776AB',
   E'pip install {name}=={version} --index-url http://localhost:5050/pypi/simple/'),
  ('maven', 'maven', 'Java/Kotlin JARs', '#C71A36',
   E'mvn dependency:get -Dartifact={ns}:{name}:{version}'),
  ('nuget', 'nuget', 'dotnet NuGet packages', '#004880',
   E'dotnet add package {name} --version {version}'),
  ('cargo', 'cargo', 'Rust crates', '#DEA584',
   E'cargo add {name}@{version} --registry nextra'),
  ('go', 'go', 'Go modules', '#00ADD8',
   E'go get {ns}/{name}@v{version}'),
  ('rpm', 'rpm', 'RHEL/Fedora .rpm packages', '#EE0000',
   E'dnf install {name}-{version}'),
  ('alpine', 'alpine', 'Alpine Linux apk packages', '#0D597F',
   E'apk add {name}={version}'),
  ('helm', 'helm', 'Kubernetes Helm charts', '#0F1689',
   E'helm install {name} nextra/{name} --version {version}'),
  ('oci', 'oci', 'OCI container images', '#2496ED',
   E'docker pull localhost:5050/{ns}/{name}:{version}'),
  ('rubygems', 'rubygems', 'Ruby gems', '#CC342D',
   E'gem install {name} -v {version}'),
  ('composer', 'composer', 'PHP Composer packages', '#885630',
   E'composer require {ns}/{name}:{version}')
ON CONFLICT (name) DO UPDATE SET
    label   = EXCLUDED.label,
    color   = EXCLUDED.color,
    install = EXCLUDED.install;

-- Update the existing generic type.
UPDATE repo_types SET
    label   = 'generic',
    color   = '#757575',
    install = E'manager repo pull {ns}/{name}@{version}'
WHERE name = 'generic' AND install = '';

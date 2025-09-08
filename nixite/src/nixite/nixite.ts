const registry: Registry = {};

enum Distro {
  UBUNTU = "ubuntu",
  ARCH = "arch",
}

interface Package {
  dependencies?: string[];
  install_system?: string;
  install_command?: string;
  update_command?: string;
  skip_if_exists?: string;
  flatpak?: string;
  snap?: "classic" | true;
}

type DistroWisePackage = Record<Distro, Package>;

type Registry = Record<string, Package | DistroWisePackage>;

function getPackageForDistro(pkg: Package | DistroWisePackage, distro: Distro) {
  if (!("ubuntu" in pkg)) return pkg;
  return pkg[distro];
}

function resolveDependencies(
  distro: Distro,
  pkgName: string,
  resolved: string[],
  visited: Set<string>,
) {
  if (visited.has(pkgName)) return;
  const pkg = getPackageForDistro(registry[pkgName], distro);
  for (const depName of pkg.dependencies || []) {
    resolveDependencies(distro, depName, resolved, visited);
  }
  resolved.push(pkgName);
}

function createInstaller(distro: Distro, selection: string[]) {
  const pkgNames = [];
  const visited = new Set<string>();
  for (const pkgName of selection) {
    resolveDependencies(distro, pkgName, pkgNames, visited);
  }
  let sh = "#!/bin/bash\n";
  // TODO: load distro specific prelude
  for (const pkg of pkgNames.map((name) => getPackageForDistro(name, distro))) {
    if (pkg.skip_if_exists) sh += `if [ ! "${pkg.skip_if_exists}" ]; then\n`;
    if (pkg.install_system) {
      if (pkg.flatpak) {
        sh += `flatpak_install ${pkg.install_system}`;
      } else if (pkg.snap) {
        sh += `sudo snap install ${pkg.snap == "classic" ? "--classic " : ""}${pkg.install_system}`;
      } else if (distro == Distro.UBUNTU) {
        sh += `aur_install ${pkg.install_system}`;
      } else if (distro == Distro.ARCH) {
        sh += `sudo apt install -y ${pkg.install_system}`;
      }
    } else if (pkg.install_command) {
      sh += `${pkg.install_command}\n`;
    }
    if (pkg.skip_if_exists) sh += "fi\n";
  }
  return sh;
}

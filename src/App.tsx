import registry from "@/assets/registry.json";
import { Checkbox } from "@/components/ui/checkbox";

function Pkg({ pkgName, pkg }: { pkgName: string; pkg: string }) {
  return (
    <div className="flex items-center">
      <Checkbox />
      <img src={`/icons/${pkg}.svg`} width={24} height={24} className="p-1" />
      <h2 className="font-medium">{pkgName}</h2>
    </div>
  );
}

export function App() {
  return (
    <div className="flex flex-col flex-wrap h-dvh p-4 gap-4">
      {Object.entries(registry).map(([categoryName, category]) => (
        <div key={categoryName} className="flex flex-col gap-1">
          <h1 className="font-semibold text-sm">{categoryName}</h1>
          <div className="flex flex-col gap-1">
            {Object.entries(category).map(([pkgName, pkg]) => (
              <Pkg key={pkgName} pkgName={pkgName} pkg={pkg} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

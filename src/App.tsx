import registry from "@/assets/registry.json";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "./components/ui/button";
import { DownloadIcon } from "lucide-react";
import * as nixite from "./lib/nixite";
import { saveAs } from "file-saver";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

function InstallerDialog({
  script,
  open,
  onOpenChange,
}: {
  script?: string;
  open: boolean;
  onOpenChange: (value: boolean) => void;
}) {
  function onSave() {
    if (!script) return;
    saveAs(new Blob([script], { type: "text/plain" }), "nixite.sh");
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Install your software</DialogTitle>
        {script && (
          <div className="relative bg-neutral-100 rounded-lg p-2 border px-4 h-[320px] overflow-hidden">
            <Button
              size="icon"
              className="absolute right-1 top-1 size-7"
              variant="outline"
              onClick={onSave}
            >
              <DownloadIcon />
            </Button>
            <pre className="overflow-scroll h-full">
              <code className="text-xs">{script}</code>
            </pre>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Pkg({
  pkgName,
  pkg,
  value,
  onValueChange,
}: {
  pkgName: string;
  pkg: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center">
      <Checkbox checked={value} onCheckedChange={onValueChange} />
      <img src={`icons/${pkg}.svg`} width={24} height={24} className="p-1" />
      <h3 className="font-medium">{pkgName}</h3>
    </div>
  );
}

function Category({
  categoryName,
  pkgs,
  selection,
  setSelection,
}: {
  categoryName: string;
  pkgs: Record<string, string>;
  selection: string[];
  setSelection: (value: string[]) => void;
}) {
  return (
    <div className="flex flex-col gap-1 mr-20">
      <h2 className="font-semibold text-sm">{categoryName}</h2>
      <div className="flex flex-col gap-1">
        {Object.entries(pkgs).map(([pkgName, pkg]) => (
          <Pkg
            key={pkgName}
            pkgName={pkgName}
            pkg={pkg}
            value={selection.includes(pkg)}
            onValueChange={(value) => {
              const newSelection = new Set(selection);
              if (value) {
                newSelection.add(pkg);
              } else {
                newSelection.delete(pkg);
              }
              setSelection([...newSelection]);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function App() {
  const [distro, setDistro] = useState<nixite.Distro>("UBUNTU");
  const [selection, setSelection] = useState<string[]>([]);
  const [script, setScript] = useState<string | null>(null);
  const [installerDialogOpen, setInstallerDialogOpen] = useState(false);
  function onInstall() {
    const script = nixite.build(distro, selection);
    setScript(script);
    setInstallerDialogOpen(true);
  }
  return (
    <div className="flex flex-col p-4 gap-4">
      <div>
        <h1 className="text-2xl">Nixite</h1>
        <h4 className="text-xs text-muted-foreground">
          installs your linux software
        </h4>
      </div>
      <div className="flex mr-auto gap-2">
        <Button size="sm" onClick={onInstall}>
          <DownloadIcon />
          Install
        </Button>
        <Select
          value={distro}
          onValueChange={(value) => setDistro(value as any)}
          defaultValue="UBUNTU"
        >
          <SelectTrigger size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="UBUNTU">Ubuntu</SelectItem>
            <SelectItem value="ARCH">Arch Linux</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col flex-wrap h-[640px] gap-4 mr-auto">
        {Object.entries(registry).map(([categoryName, category]) => (
          <Category
            key={categoryName}
            categoryName={categoryName}
            pkgs={category}
            selection={selection}
            setSelection={setSelection}
          />
        ))}
      </div>
      <InstallerDialog
        script={script}
        open={installerDialogOpen}
        onOpenChange={setInstallerDialogOpen}
      />
    </div>
  );
}

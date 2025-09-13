import { Moon, Sun } from "lucide-react"

import { Switch } from "@/components/ui/switch"
import { useTheme } from "./theme-provider";

export function ModeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="flex items-center gap-2">
            <Switch
                checked={theme === "dark"}
                onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
            />
            {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
        </div>
    )
}
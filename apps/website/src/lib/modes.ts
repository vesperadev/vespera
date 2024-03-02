import { LayoutIcon, LibraryIcon, type LucideIcon, PaperclipIcon } from 'lucide-react';

export interface Mode {
  param: string;
  name: string;
  package: string;
  description: string;
  version: string;
  icon: LucideIcon;
}

export const modes: Mode[] = [
  {
    param: 'vespera',
    name: 'Vespera',
    package: 'vespera',
    description: 'The main package',
    version: '0.1.0',
    icon: LibraryIcon,
  },
  {
    param: 'builders',
    name: '@vespera/builders',
    package: '@vespera/builders',
    description: 'The builders package',
    version: '0.1.0',
    icon: LayoutIcon,
  },
  {
    param: 'core',
    name: '@vespera/core',
    package: '@vespera/core',
    description: 'The core package',
    version: '0.1.0',
    icon: PaperclipIcon,
  },
];

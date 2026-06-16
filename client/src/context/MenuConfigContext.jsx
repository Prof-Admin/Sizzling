import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import {
  GUEST_TIERS, STYLES, PALETTE, MENU_SECTIONS, BRUNCH_PACKAGES,
  PLATTER_TRAYS, PLATTER_SMALL_CHOPS, PLATTER_BRUNCH, FS_PACKAGES, FS_MENU,
} from './OrderContext';

const defaults = {
  'guest-tiers': GUEST_TIERS,
  'grazing-styles': STYLES,
  'grazing-menu': MENU_SECTIONS,
  'brunch-packages': BRUNCH_PACKAGES,
  'platter-trays': PLATTER_TRAYS,
  'platter-smallchops': PLATTER_SMALL_CHOPS,
  'platter-brunch': PLATTER_BRUNCH,
  'fs-packages': FS_PACKAGES,
  'fs-menu': FS_MENU,
  'staff-config': { hourlyRate: 16.67, minHours: 6 },
};

export const MenuConfigContext = createContext(defaults);

export function MenuConfigProvider({ children }) {
  const [config, setConfig] = useState(defaults);

  useEffect(() => {
    axios.get('/api/menu-config')
      .then(res => { if (res.data.success) setConfig(prev => ({ ...prev, ...res.data.data })); })
      .catch(() => {});
  }, []);

  return <MenuConfigContext.Provider value={config}>{children}</MenuConfigContext.Provider>;
}

export function useMenuConfig() {
  const config = useContext(MenuConfigContext);
  return {
    guestTiers: config['guest-tiers'],
    styles: config['grazing-styles'],
    palette: PALETTE,
    menuSections: config['grazing-menu'],
    brunchPackages: config['brunch-packages'],
    platterTrays: config['platter-trays'],
    platterSmallChops: config['platter-smallchops'],
    platterBrunch: config['platter-brunch'],
    fsPackages: config['fs-packages'],
    fsMenu: config['fs-menu'],
    staffConfig: config['staff-config'],
  };
}

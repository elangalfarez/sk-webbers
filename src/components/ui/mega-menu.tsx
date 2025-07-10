// component.tsx
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export type MegaMenuItem = {
  id: number;
  label: string;
  subMenus?: {
    title: string;
    items: {
      label: string;
      description: string;
      icon: React.ElementType;
    }[];
  }[];
  link?: string;
};

export interface MegaMenuProps extends React.HTMLAttributes<HTMLUListElement> {
  items: MegaMenuItem[];
  className?: string;
}

const MegaMenu = React.forwardRef<HTMLUListElement, MegaMenuProps>(
  ({ items, className, ...props }, ref) => {
    const [openMenu, setOpenMenu] = React.useState<string | null>(null);
    const [isHover, setIsHover] = React.useState<number | null>(null);

    const handleHover = (menuLabel: string | null) => {
      setOpenMenu(menuLabel);
    };

    return (
      <ul
        ref={ref}
        className={`relative flex items-center space-x-0 ${className || ""}`}
        {...props}
      >
        {items.map((navItem) => (
          <li
            key={navItem.label}
            className="relative"
            onMouseEnter={() => handleHover(navItem.label)}
            onMouseLeave={() => handleHover(null)}
          >
            <button
              className="relative flex cursor-pointer items-center justify-center gap-1 py-1.5 px-4 text-sm text-gray-700 transition-colors duration-300 hover:text-primary group"
              onMouseEnter={() => setIsHover(navItem.id)}
              onMouseLeave={() => setIsHover(null)}
            >
              <span>{navItem.label}</span>
              {navItem.subMenus && (
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 group-hover:rotate-180 ${
                    openMenu === navItem.label ? "rotate-180" : ""
                  }`}
                />
              )}
              {(isHover === navItem.id || openMenu === navItem.label) && (
                <motion.div
                  layoutId="hover-bg"
                  className="absolute inset-0 size-full bg-purple-100/50"
                  style={{
                    borderRadius: 99,
                  }}
                />
              )}
            </button>

            <AnimatePresence>
              {openMenu === navItem.label && navItem.subMenus && (
                <div className={`absolute ${navItem.label === 'Contact' ? 'right-0' : 'left-0'} top-full w-auto pt-2 z-10`}>
                  <motion.div
                    className="w-max border border-gray-200 bg-white/95 backdrop-blur-md p-6 shadow-xl"
                    style={{
                      borderRadius: 16,
                    }}
                    layoutId="menu"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex w-fit shrink-0 space-x-9 overflow-hidden">
                      {navItem.subMenus.map((sub) => (
                        <motion.div layout className="w-full min-w-[200px]" key={sub.title}>
                          <h3 className="mb-4 text-sm font-semibold text-primary">
                            {sub.title}
                          </h3>
                          <ul className="space-y-3">
                            {sub.items.map((item) => {
                              const Icon = item.icon;
                              return (
                                <li key={item.label}>
                                  <a
                                    href="#"
                                    className="flex items-start space-x-3 group p-2 rounded-lg hover:bg-amber-50 transition-colors duration-200"
                                  >
                                    <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-amber-100 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                                      <Icon className="h-4 w-4 flex-none" />
                                    </div>
                                    <div className="w-max leading-5">
                                      <p className="shrink-0 text-sm font-medium text-gray-900">
                                        {item.label}
                                      </p>
                                      <p className="shrink-0 text-xs text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
                                        {item.description}
                                      </p>
                                    </div>
                                  </a>
                                </li>
                              );
                            })}
                          </ul>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </li>
        ))}
      </ul>
    );
  }
);

MegaMenu.displayName = "MegaMenu";

export default MegaMenu;
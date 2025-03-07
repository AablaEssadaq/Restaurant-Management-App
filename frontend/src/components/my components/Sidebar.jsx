"use client"

import { useState } from "react"
import {
  Monitor,
  Users2,
  ClipboardList,
  Package,
  BookOpenCheck,
  UserCog,
  Settings,
  ChevronDown,
  ChevronRight,
  BookUser,
  Truck,
  CircleUserRound,
  BarChartBigIcon as ChartColumnBig,
  BookOpen,
  ChevronLeft,
} from "lucide-react"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const Sidebar = () => {
  const restaurant = useSelector((state) => state.auth.restaurant)
  const [suppliersOpen, setSuppliersOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const sidebarItems = [
    { icon: ChartColumnBig, label: "Tableau de board", href: "/dashboard" },
    { icon: Monitor, label: "Logistiques", href: "/logistics" },
    {
      icon: Users2,
      label: "Fournisseurs",
      href: "/suppliers",
      subItems: [
        { icon: BookUser, label: "Liste des Fournisseurs", href: "/suppliers/list" },
        { icon: Truck, label: "Commandes", href: "/suppliers/orders" },
      ],
    },
    { icon: BookOpen, label: "Menu", href: "/menu" },
    { icon: ClipboardList, label: "Commandes", href: "/orders" },
    { icon: Package, label: "Stock", href: "/stock" },
    { icon: BookOpenCheck, label: "Réservations", href: "/reservations" },
    { icon: UserCog, label: "Managers", href: "/managers" },
    { icon: CircleUserRound, label: "Profile", href: "/owner/profile" },
    { icon: Settings, label: "Paramètres", href: "/settings" },
  ]

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  return (
    <aside
      className={`${collapsed ? "w-16" : "w-64"} bg-[#790117] text-white transition-all duration-300 ease-in-out relative`}
    >
      <div className={`${collapsed ? "px-1 py-4" : "p-4"} border-b border-white/10 flex items-center justify-between relative`}>
        <div className="flex items-center gap-2">
          <img
            className="w-8 h-8 rounded-full"
            src={restaurant?.logo || "frontend/src/assets/Fork_and_knife.jpeg"}
            alt="logo"
          />
          {!collapsed && <h2 className="font-semibold">{restaurant?.name || "Restaurant"}</h2>}
        </div>
        <button onClick={toggleSidebar} className="text-white p-1 rounded-md hover:bg-white/10 transition-colors">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-16 bg-[#790117] text-white p-1 rounded-full border border-white/20 hover:bg-[#8a0119] transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button> */}

      <nav className={`${collapsed ? "px-1" : "px-2"} pt-1`}>
        <TooltipProvider delayDuration={300}>
          {sidebarItems.map((item, index) => (
            <div key={index}>
              {item.subItems ? (
                <div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setSuppliersOpen(!suppliersOpen)}
                        className={`flex items-center ${collapsed ? "justify-center" : "justify-between"} w-full ${collapsed ? "px-2" : "px-3"} py-2 rounded-lg hover:text-white hover:bg-white/10 transition-colors`}
                      >
                        <div
                          className={`flex items-center ${collapsed ? "justify-center" : ""} ${collapsed ? "gap-0" : "gap-3"}`}
                        >
                          <item.icon className="w-5 h-5" />
                          {!collapsed && <span>{item.label}</span>}
                        </div>
                        {!collapsed &&
                          (suppliersOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />)}
                      </button>
                    </TooltipTrigger>
                    {collapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
                  </Tooltip>

                  {suppliersOpen && (
                    <div
                      className={`${collapsed ? "absolute left-16 top-0 bg-[#790117] p-2 rounded-lg border border-white/10 min-w-40 z-10" : "ml-6 mt-1"} space-y-1`}
                    >
                      {item.subItems.map((subItem, subIndex) => (
                        <Tooltip key={subIndex}>
                          <TooltipTrigger asChild>
                            <Link
                              to={subItem.href}
                              className={`flex items-center ${collapsed ? "justify-center" : ""} ${collapsed ? "gap-2" : "gap-3"} ${collapsed ? "px-2" : "px-3"} py-2 rounded-lg hover:text-white hover:bg-white/10 transition-colors text-sm`}
                            >
                              <subItem.icon className="w-5 h-5" />
                              <span>{subItem.label}</span>
                            </Link>
                          </TooltipTrigger>
                          {collapsed && <TooltipContent side="right">{subItem.label}</TooltipContent>}
                        </Tooltip>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.href}
                      className={`flex items-center ${collapsed ? "justify-center" : ""} ${collapsed ? "gap-0" : "gap-3"} ${collapsed ? "px-2" : "px-3"} py-2 rounded-lg hover:text-white hover:bg-white/10 transition-colors`}
                    >
                      <item.icon className="w-5 h-5" />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  </TooltipTrigger>
                  {collapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
                </Tooltip>
              )}
            </div>
          ))}
        </TooltipProvider>
      </nav>
    </aside>
  )
}

export default Sidebar


import React, { useState } from "react"
import { Users, Monitor, Users2, Menu, ClipboardList, Package, BookOpenCheck, UserCog, Settings, ChevronDown, ChevronRight, BookUser, Truck } from "lucide-react"
import { Link } from "react-router-dom"
import { useRestaurant } from "@/context/RestaurantContext";
import { useSelector } from "react-redux";

const Sidebar = () => {

 // const { restaurant } = useRestaurant();
 const restaurant = useSelector((state) => state.auth.restaurant); 
 
  const [suppliersOpen, setSuppliersOpen] = useState(false)

  const sidebarItems = [
    { icon: Users, label: "Tableau de board", href: "/dashboard" },
    { icon: Monitor, label: "Logistiques", href: "/logistics" },
    { icon: Users2, label: "Fournisseurs", href: "/suppliers", subItems: [
      { icon: BookUser, label: "Liste des Fournisseurs", href: "/suppliers/list" },
      { icon: Truck, label: "Commandes", href: "/suppliers/orders" },
    ], },
    { icon: Menu, label: "Menu", href: "/menu" },
    { icon: ClipboardList, label: "Commandes", href: "/orders" },
    { icon: Package, label: "Stock", href: "/stock" },
    { icon: BookOpenCheck, label: "Réservations", href: "/reservations" },
    { icon: UserCog, label: "Managers", href: "/managers" },
    { icon: Settings, label: "Paramètres", href: "/settings" },
  ]

  return (
    <aside className="w-64 bg-[#790117] text-white">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
        <img className="w-8 h-8 rounded-full" src={restaurant?.logo || "frontend/src/assets/Fork_and_knife.jpeg"} alt="logo" />
        <h2 className="font-semibold">{restaurant?.name || "Restaurant"}</h2>
        </div>
      </div>

      <nav className="p-2">
      {sidebarItems.map((item, index) => (
          <div key={index}>
            {item.subItems ? (
              <div>
                <button
                  onClick={() => setSuppliersOpen(!suppliersOpen)}
                  className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:text-white hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {suppliersOpen? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                {suppliersOpen && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.subItems.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        to={subItem.href}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:text-white hover:bg-white/10 transition-colors text-sm"
                      >
                        <subItem.icon className="w-5 h-5" />
                        <span>{subItem.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                to={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:text-white hover:bg-white/10 transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar


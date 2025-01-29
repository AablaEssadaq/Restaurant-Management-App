import React from "react"
import { Users, Monitor, Users2, Menu, ClipboardList, Package, BookOpenCheck, UserCog, Settings } from "lucide-react"
import { Link } from "react-router-dom"
import { useRestaurant } from "@/context/RestaurantContext";

const Sidebar = () => {

  const { restaurant } = useRestaurant();

  return (
    <aside className="w-64 bg-[#790117] text-white">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <img className="w-8 h-8 rounded-full" src={restaurant.logo} alt="logo"/>  
          <h2 className="font-semibold">{restaurant.name}</h2>
        </div>
      </div>

      <nav className="p-2">
        {[
          { icon: Users, label: "Tableau de board", href: "/dashboard" },
          { icon: Monitor, label: "Logistiques", href: "/page1" },
          { icon: Users2, label: "Fournisseurs", href: "/suppliers" },
          { icon: Menu, label: "Menu", href: "/menu" },
          { icon: ClipboardList, label: "Commandes", href: "/orders" },
          { icon: Package, label: "Stock", href: "/stock" },
          { icon: BookOpenCheck, label: "Réservations", href: "/reservations" },
          { icon: UserCog, label: "Managers", href: "/managers" },
          { icon: Settings, label: "Paramètres", href: "/settings" },
        ].map((item, index) => (
          <Link
            key={index}
            to={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:text-white hover:bg-white/10 transition-colors"
          >
            <item.icon className="w-5 h-5"/>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar


import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const Breadcrumbs = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { state } = location
  
  const generateBreadcrumbs = () => {
    const paths = location.pathname.split("/").filter((x) => x)
    let currentLink = ""
    
    return paths.map((path, index) => {
      currentLink += `/${path}`
      const isLast = index === paths.length - 1
      
      // Format the display name to be more user-friendly
      let displayName = path
      if (path === "subcategories" && state?.selectedCategory) {
        displayName = state.selectedCategory.name
      } else {
        // Capitalize first letter and replace hyphens with spaces
        displayName = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ')
      }

      return (
        <React.Fragment key={path}>
          <BreadcrumbItem>
            {isLast ? (
              <BreadcrumbPage>{displayName}</BreadcrumbPage>
            ) : (
              <button
                onClick={() => {
                  // For logistics specifically, always navigate to /logistics
                  if (path === "logistics") {
                    navigate("/logistics", { replace: true });
                  } else {
                    navigate(currentLink, { replace: true });
                  }
                }}
                className="text-blue-600 hover:underline"
              >
                {displayName}
              </button>
            )}
          </BreadcrumbItem>
          {!isLast && <BreadcrumbSeparator />}
        </React.Fragment>
      )
    })
  }
  
  return (
    <div className="mx-8 my-3">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <button
              onClick={() => navigate("/")}
              className="text-blue-600 hover:underline"
            >
              Home
            </button>
          </BreadcrumbItem>
          {location.pathname !== "/" && <BreadcrumbSeparator />}
          {generateBreadcrumbs()}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}

export default Breadcrumbs
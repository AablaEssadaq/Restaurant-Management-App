import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb"

const Breadcrumbs = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const generateBreadcrumbs = () => {
        const paths = location.pathname.split("/").filter((x) => x)
        let currentLink = ""
    
        return paths.map((path, index) => {
          currentLink += `/${path}`
          const isLast = index === paths.length - 1
    
          return (
            <React.Fragment key={path}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{path}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink onClick={(e) => {
                    e.preventDefault()
                    navigate(currentLink)
                  }} href={currentLink}>
                    {path}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </React.Fragment>
          )
        })
      }
    
  return (
    <>
     <div className="mx-8 my-3">
              <Breadcrumb>
                <BreadcrumbList>
                {/*
                  <BreadcrumbItem>
                    <BreadcrumbLink as={Link} to="/">
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
    */}
                  {generateBreadcrumbs()}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
    </>
  )
}

export default Breadcrumbs
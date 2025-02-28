import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import api from '@/config/api';
import { Search } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const LogisticsItems = () => {
    const location = useLocation();
    const { subcategoryName } = location.state || {};
    const [items, setItems] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(5)
    const [searchQuery, setSearchQuery] = useState("")
    

    const columns = [
        { label: "Equipements", key: "name" },
        { label: "Marque", key: "brand" },
        { label: "Quantité", key: "quantity" },
        { label: "En panne", key: "damaged" },
    ];

   const fetchItems = useCallback(async () => {
    api.post("/api/logistics/items",{ subcategoryName })
   .then((response) => {
    setItems(response.data.items);
   })
    .catch((error)=>{
      console.error("Erreur de récupération des equipements:", error);
    })
    
  }, [subcategoryName]); // Dependencies for useCallback

  useEffect(() => {
    if (subcategoryName) {
      fetchItems()
    }
  }, [subcategoryName, fetchItems])

   //Filter orders
   const filteredItems = items.filter((item) => {
    const searchFields = [
      item.name?.toString() || "",
      item.quantity?.toString() || "",
      item.damaged?.toString() || ""
    ].map(field => field.toLowerCase()); // Now all fields are strings
  
    const query = searchQuery.toLowerCase();
    
    return searchFields.some(field => field.includes(query));
  });
  

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])


        // Calculate pagination with filtered results
        const totalItems = filteredItems.length
        const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))
        const indexOfLastItem = currentPage * itemsPerPage
        const indexOfFirstItem = indexOfLastItem - itemsPerPage
        const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem)

      // Ensure current page is within valid range
      useEffect(() => {
        if (currentPage > totalPages) {
          setCurrentPage(totalPages)
        }
      }, [totalPages, currentPage])
    
   
      // Handle page changes
      const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
          setCurrentPage(pageNumber)
        }
      }
  
       // Generate page numbers array
     const getPageNumbers = () => {
      const pageNumbers = []
      const maxPagesToShow = 5 // Show up to 5 page numbers
      
      if (totalPages <= maxPagesToShow) {
        // If total pages is less than max pages to show, display all pages
        for (let i = 1; i <= totalPages; i++) {
          pageNumbers.push(i)
        }
      } else {
        // Always show first page
        pageNumbers.push(1)
        
        // Calculate start and end of page numbers to show
        let start = Math.max(2, currentPage - 1)
        let end = Math.min(totalPages - 1, currentPage + 1)
        
        // Adjust start and end to always show 3 pages
        if (currentPage <= 2) {
          end = 4
        }
        if (currentPage >= totalPages - 1) {
          start = totalPages - 3
        }
        
        // Add ellipsis if needed
        if (start > 2) {
          pageNumbers.push('...')
        }
        
        // Add page numbers
        for (let i = start; i <= end; i++) {
          pageNumbers.push(i)
        }
        
        // Add ellipsis if needed
        if (end < totalPages - 1) {
          pageNumbers.push('...')
        }
        
        // Always show last page
        pageNumbers.push(totalPages)
      }
      
      return pageNumbers
    }
  

  return (
    <>
    { /* <div>{`Logistics Items of the ${subcategoryName} category`}</div>
    { items.length != 0 ? items.map((item,index)=>{
        return <div key={index}>{item.name}</div>
    }) : <div>No items found</div>}
*/}
<div className='px-8 pt-2 pb-2'>
      <div className='flex  justify-between items-center'>
      <div className='flex gap-1'>
      <Input className="h-8 bg-white" placeholder="Recherche" value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} />
      <Search/>
      </div>
      </div>
      <br/>

         { /*Suppliers Orders Table */}
      <div className="overflow-auto pb-4">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col, index) => (
              <TableHead key={index} className="text-black">
                {col.label}
              </TableHead>
            ))}
            <TableHead className="text-black text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={columns.length + 1} className="text-center py-4">
                            Aucun résultat trouvé
                          </TableCell>
                        </TableRow>
                      ) : 
          
          (currentItems.map((item, index) => (
            <TableRow key={index}>
             {columns.map((col, colIndex) => (
          <TableCell key={colIndex}>
               {item[col.key]}
          </TableCell>
          ))}
              <TableCell>
                <div className="flex gap-2 justify-center items-center">
                    <Button size='sm' className='bg-yellow hover:bg-yellow-hover'>Modifier</Button>
                    <Button size='sm' className='bg-orange hover:bg-orange-hover'>Réparer</Button>
                    <Button size='sm' className='bg-burgundy hover:bg-burgundy-hover'>Supprimer</Button>
               </div>
              </TableCell>
            </TableRow>
          )))}
        </TableBody>
      </Table>
    </div>

    <div className="flex justify-center items-center mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem className="cursor-pointer">
              <PaginationPrevious
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {getPageNumbers().map((pageNumber, index) => (
              <PaginationItem key={index}>
                {pageNumber === '...' ? (
                  <span className="px-3 py-2">...</span>
                ) : (
                  <PaginationLink className="cursor-pointer"
                    onClick={() => paginate(pageNumber)}
                    isActive={currentPage === pageNumber}
                  >
                    {pageNumber}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
            
            <PaginationItem className="cursor-pointer">
              <PaginationNext
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
    </>
    
  )
}

export default LogisticsItems
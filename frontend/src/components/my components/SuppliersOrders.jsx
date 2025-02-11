import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Search } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useCallback, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import axios from "axios"
import { format } from "date-fns"
import fr from "date-fns/locale/fr" // Pour un affichage en français
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "@/hooks/use-toast"
import NewOrderDialog from "./NewOrderDialog"
import OrderDetailsDialog from "./OrderDetailsDialog"

const formatDate = (dateString) => {
  return format(new Date(dateString), "dd-MM-yyyy", { locale: fr })
}

const orderSchema = z.object({
  orderDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "La date de commande est invalide",
  }), // Ensures it's a valid date string

  shippingDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "La date de livraison est invalide",
  }),

  /*status: z.enum(["En cours", "Livrée", "Annulée"], {
    message: "Statut invalide",
  }),*/

  supplier: z.string().min(1, "Le fournisseur est requis"),
    
  
  products: z
    .array(
      z.object({
        name: z.string().min(1, "Le nom du produit est requis"),
        quantity: z.number().min(1, "La quantité doit être au moins 1"),
        price: z.number().min(0, "Le prix ne peut pas être négatif"),
      })
    )
    .min(1, "Au moins un produit est requis"),

 // total: z.number().min(0, "Le total ne peut pas être négatif"),
});


const apiUrl = import.meta.env.VITE_URL_BASE

const SuppliersOrders = () => {

  const user = useSelector((state) => state.auth.user)
  const [ordersData, setOrdersData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItem, setSelectedItem] = useState(null)
  const [editFormData, setEditFormData] = useState({})

  const form = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      orderDate: new Date().toISOString(),
      shippingDate: new Date().toISOString(), 
     // status: "",
      supplier: "",
      products: [],
     // total: 0,
    },
  })

  const handleOpen = (item) => {
    console.log(item)
    setSelectedItem(item)
  }

  const handleEditInputChange = (event) => {
    const { name, value } = event.target
    setEditFormData((prevData) => ({ ...prevData, [name]: value }))
  }

    // Move fetchSuppliers to useCallback to prevent recreation
  const fetchOrders = useCallback(async () => {
      try {
        const response = await axios.post(`${apiUrl}/api/suppliers/orders`, { owner_id: user._id })
        setOrdersData(response.data.orders)
      } catch (error) {
        console.error("Erreur de récupération des commandes:", error)
      }
    }, [user._id])
  
    useEffect(() => {
      if (user._id) {
        fetchOrders()
      }
    }, [user._id, fetchOrders])

    //Filter orders
    const filteredOrders = ordersData.filter((order) => {
      const searchFields = [
        order.supplier.firstName,
        order.supplier.lastName,
        order.status,
        order.orderDate,
        order.shippingDate,
        
      ].map(field => (field || "").toLowerCase())
      
      const query = searchQuery.toLowerCase()
      
      return searchFields.some(field => field.includes(query))
    })
  
    // Reset to first page when search query changes
    useEffect(() => {
      setCurrentPage(1)
    }, [searchQuery])

      // Calculate pagination with filtered results
  const totalItems = filteredOrders.length
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem)

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

    const uniqueSuppliers = useSelector((state) => state.suppliers.suppliers); 
    
     /*[
     ...new Map(
        ordersData.map(order => [order.supplier._id, order.supplier])
      ).values() 
    ];*/

    
    const columns = [
        { label: "Fournisseur", key: "supplier.fullName" },
        { label: "Date de commande", key: "orderDate" },
        { label: "Date de livraison", key: "shippingDate" },
        { label: "Statut", key: "status" }
    ];

    const handleDelete = async (order) => {
      try {
        await axios.delete(`${apiUrl}/api/suppliers/orders/delete/${order._id}`)
        
        // Update local state immediately
        setOrdersData(currentOrders => 
          currentOrders.filter(s => s._id !== order._id)
        )
        
        // Check if we need to adjust current page
        const newTotalItems = ordersData.length - 1
        const newTotalPages = Math.max(1, Math.ceil(newTotalItems / itemsPerPage))
        if (currentPage > newTotalPages) {
          setCurrentPage(newTotalPages)
        }
  
        toast({
          title: "Succès",
          description: "Commande supprimée.",
          className: "border-green-500 bg-green-100 text-green-900",
        })
      } catch (error) {
        console.error("Erreur lors de la suppression:", error.response?.data || error.message)
        toast({
          variant: "destructive",
          title: "Erreur",
          description: error.response?.data?.message || "Une erreur s'est produite.",
        })
        // Refresh the list in case of error to ensure consistency
        fetchOrders()
      }
    }

  return (
    <>
     <div className='px-8 pt-2 pb-2'>
      <div className='flex  justify-between items-center'>
      <div className='flex gap-1'>
      <Input className="h-8 bg-white" placeholder="Recherche" value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} />
      <Search/>
      </div>
      <NewOrderDialog uniqueSuppliers={uniqueSuppliers} fetchOrders={fetchOrders} />
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
            {col.key === "supplier.fullName"
             ? `${item.supplier.firstName} ${item.supplier.lastName}`
             : col.key === "orderDate" || col.key === "shippingDate"
             ? formatDate(item[col.key]) // Formate la date
             : col.key === "status"
             ? (
               <Badge className={` 
                ${item[col.key] === "livrée" ? "bg-green-500 hover:bg-green-500 text-white" : ""} 
                ${item[col.key] === "En cours" ? "bg-yellow hover:bg-yellow text-white" : ""} 
                ${item[col.key] === "Annulée" ? "bg-red-500 hover:bg-red-500 text-white" : ""} 
              `}>
               {item[col.key]}
               </Badge>
              )
             : col.key.includes('.')
             ? col.key.split('.').reduce((acc, curr) => acc?.[curr], item)
             : item[col.key]
            }
          </TableCell>
          ))}
              <TableCell>
                <div className="flex gap-2 justify-center items-center">
                <OrderDetailsDialog order={item} />
                  <Button className="bg-orange hover:bg-orange-hover" size="sm">
                    Modifier
                  </Button>
                  <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="bg-burgundy hover:bg-burgundy-hover" size="sm">
                          Supprimer
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Voulez vous vraiment supprimer cette commande?</AlertDialogTitle>
                          <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-burgundy hover:bg-burgundy-hover"
                            onClick={() => handleDelete(item)}
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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

export default SuppliersOrders
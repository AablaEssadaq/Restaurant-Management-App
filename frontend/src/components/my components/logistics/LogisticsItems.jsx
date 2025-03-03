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
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Search } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useLocation } from 'react-router-dom';
import { z } from "zod";
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import ItemsEditDialog from "./ItemsEditDialog";

const LogisticsItems = () => {

    const location = useLocation();
    const category = location.state?.category || {};  // Ensures category is never undefined
    const subcategoryName = location.state?.subcategoryName || "Unknown";
    
    if (!category._id) {
      console.error("Category ID is missing!");
    }
    
    const [items, setItems] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(5)
    const [searchQuery, setSearchQuery] = useState("")
    const [open, setOpen] = useState(false)
    const restaurant = useSelector((state) => state.auth.restaurant); 
    const [repairQuantity, setRepairQuantity] = useState(0); // État pour stocker l'input

    

    const columns = [
        { label: "Equipements", key: "name" },
        { label: "Marque", key: "brand" },
        { label: "Quantité", key: "quantity" },
        { label: "En panne", key: "damaged" },
    ];

    // ✅ Define Zod schema for validation
    const equipementSchema = z.object({
      name: z.string().min(2, "Le nom est trop court"),
      categoryId: z.string().min(1, "L'ID de la catégorie est requis"), // Validate categoryId
      subcategory: z.string().min(2, "Le nom de la sous-catégorie est trop court"),
      quantity: z.number().int().min(0, "La quantité ne peut pas être négative"),
      damaged: z.number().int().min(0, "Le nombre d'équipements endommagés ne peut pas être négatif"),
      brand: z.string().min(1, "La marque est trop courte").optional().default(""),
    });
    
    const form = useForm({
        resolver: zodResolver(equipementSchema),
        defaultValues: {
          name: "",
          subcategory: subcategoryName ,
          categoryId: category._id,
          quantity: 0,
          damaged: 0,
          brand: "",
        },
    })


    // ✅ Handle form submission
  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      restaurantId :restaurant._id,
    }
    console.log(formattedData)
    api.post('/api/logistics/items/add',formattedData)
    .then(response => {
      console.log(response.data)
      toast({
        title: "Succès",
        description: "Equipement ajouté.",
        className: "border-green-500 bg-green-100 text-green-900",
      })
      setOpen(false)
      form.reset()
      fetchItems()
    })
    .catch((error)=> {
      console.error("Error submitting form:", error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `${error ||
        "Une erreur s'est produite."}`,
      })
      });
  }

  const handleDelete = async(item) => {
    api.delete(`/api/logistics/items/delete/${item._id}`)
    .then(response => {
      console.log(response.data)
      toast({
        title: "Succès",
        description: "Equipement supprimé.",
        className: "border-green-500 bg-green-100 text-green-900",
      })
      fetchItems()
    })
    .catch((error)=> {
      console.error("Error deleting the equipement : ", error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `${error ||
        "Une erreur s'est produite."}`,
      })
      });
    
  }

  const handleRepair = async (item) => {
    if (!repairQuantity || repairQuantity <= 0) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `Veuillez entrez un nombre valide`,
      })
      return;
    }
    const data = {
      id: item._id,
      fixed: repairQuantity
    }
    api.post(`/api/logistics/items/repair`, data)
    .then(response => {
      console.log(response.data)
      toast({
        title: "Succès",
        description: "Equipements réparés.",
        className: "border-green-500 bg-green-100 text-green-900",
      })
      fetchItems()
    })
    .catch((error)=> {
      console.error("Error repairing the equipement : ", error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `${error ||
        "Une erreur s'est produite."}`,
      })
      });
  }

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
      item.brand?.toString() || "",
      item.quantity?.toString() || "",
      item.damaged?.toString() || "",
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
      <div className='px-8 pt-2 pb-2'>
      <div className='flex  justify-between items-center'>
      <div className='flex gap-1'>
      <Input className="h-8 bg-white" placeholder="Recherche" value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} />
      <Search/>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className=
          "bg-green-600 hover:bg-green-800">
              <span>
                <Plus />
              </span>
              Nouveau Equipement
            </Button>
          </DialogTrigger>
          <DialogContent className="md:max-w-[600px] max-h-[550px] overflow-auto">
            <DialogHeader>
              <DialogTitle>Nouveau équipement</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4 py-4">
 
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Equipement</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>

                   <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marque</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantité</FormLabel>
                      <FormControl>
                        <Input {...field} type="number"  onChange={(e) => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>

                <FormField
                  control={form.control}
                  name="damaged"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>En panne</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" onChange={(e) => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div>{/* An empty div to fix the footer alignment */}</div>
                <DialogFooter>
                  <Button className="bg-orange hover:bg-orange-hover" type="submit">
                    Enregistrer
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
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
                      <ItemsEditDialog item={item} fetchItems={fetchItems} />
                      <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="bg-orange hover:bg-orange-hover" size="sm">
                         Réparer
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Entrez le nombre d'équipements réparés</AlertDialogTitle>
                          <AlertDialogDescription>
                            <Input className='w-1/2 mt-3' type="number"  value={repairQuantity}
                              onChange={(e) => setRepairQuantity(e.target.value)} />
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-orange hover:bg-orange-hover"
                            onClick={() => handleRepair(item)}
                          >
                            Enregistrer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="bg-burgundy hover:bg-burgundy-hover" size="sm">
                          Supprimer
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Voulez vous vraiment supprimer cet équipement ?</AlertDialogTitle>
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

export default LogisticsItems
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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import api from "@/config/api"
import { toast } from "@/hooks/use-toast"
import { setSuppliers } from "@/store/suppliersSlice"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Search } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { z } from "zod"
import { Button } from "../ui/button"
import { Input } from "../ui/input"


// ✅ Define Zod schema for validation
const supplierSchema = z.object({
  lastName: z.string().min(2, "Le nom est trop court"),
  firstName: z.string().min(2, "Le prénom est trop court"),
  phoneNumber: z.string().regex(/^0[567][0-9]{8}$/, "Numéro invalide"),
  email: z.string().email("Email invalide"),
  country: z.string().min(4, "Sélectionnez un pays"),
  city: z.string().min(1, "Sélectionnez une ville"),
  street: z.string().min(5, "Adresse trop courte"),
  category: z.string().min(1, "Sélectionnez une catégorie"),
  paymentMethod: z.string().min(1, "Sélectionnez un mode de paiement"),
  rib: z.string().optional(),
})

//columns to show on the table
const columns = [
  { label: "Nom", key: "lastName" },
  { label: "Prénom", key: "firstName" },
  { label: "Catégorie", key: "category" },
  { label: "Téléphone", key: "phoneNumber" },
  { label: "Email", key: "email" },
]

const SuppliersList = () => {
  // const { user } = useUser()
  const user = useSelector((state) => state.auth.user)
  const [suppliersData, setSuppliersData] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [editFormData, setEditFormData] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [searchQuery, setSearchQuery] = useState("")

  const dispatch = useDispatch();

  const handleOpen = (item) => {
    console.log(item)
    setSelectedItem(item)
  }

  const handleEditInputChange = (event) => {
    const { name, value } = event.target
    setEditFormData((prevData) => ({ ...prevData, [name]: value }))
  }

   // Move fetchSuppliers to useCallback to prevent recreation
   const fetchSuppliers = useCallback(async () => {
    api.post("/api/suppliers/list",{ owner_id: user._id })
   .then((response) => {
    setSuppliersData(response.data.suppliers);
    dispatch(setSuppliers({ suppliers: response.data.suppliers }));
   })
    .catch((error)=>{
      console.error("Erreur de récupération des fournisseurs:", error);
    })
    
  }, [user._id, dispatch]); // Dependencies for useCallback

  useEffect(() => {
    if (user._id) {
      fetchSuppliers()
    }
  }, [user._id, fetchSuppliers])

  //Filter suppliers
  const filteredSuppliers = suppliersData.filter((supplier) => {
    const searchFields = [
      supplier.lastName,
      supplier.firstName,
      supplier.category,
      supplier.phoneNumber,
      supplier.email
    ].map(field => (field || "").toLowerCase())
    
    const query = searchQuery.toLowerCase()
    
    return searchFields.some(field => field.includes(query))
  })

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])


    // Calculate pagination with filtered results
  const totalItems = filteredSuppliers.length
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredSuppliers.slice(indexOfFirstItem, indexOfLastItem)

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

  const form = useForm({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      lastName: "",
      firstName: "",
      phoneNumber: "",
      email: "",
      country: "",
      city: "",
      street: "",
      category: "",
      paymentMethod: "",
      rib: "",
    },
  })

  // ✅ Handle form submission
  const onSubmit = async (values) => {
    console.log("Form sent:", { ...values, owner_id: user._id })

    api.post("/api/suppliers/list/add", {
      ...values,
      owner_id: user._id, // ✅ Ajout correct de l'owner
    })
    .then(response => {
      console.log("Fournisseur ajouté avec succès:", response.data)
      toast({
        title: "Succès",
        description: "Fournisseur ajouté.",
        className: "border-green-500 bg-green-100 text-green-900",
      })
      form.reset()
      fetchSuppliers();
    })
    .catch((error)=> {
      console.error("Erreur lors de l'envoi:", error.response?.data || error.message)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.response?.data?.message || "Une erreur s'est produite.",
      })
    });

  }

  const handleEditSubmit = async (e) => {
    e.preventDefault() // Prevent default form submission
    console.log("Edit form submitted:", editFormData)

    api.put(`/api/suppliers/list/update/${selectedItem._id}`, {
      ...editFormData,
      owner_id: user._id,
    })
    .then(response => {
      console.log("Fournisseur modifié avec succès:", response.data)
      toast({
        title: "Succès",
        description: "Fournisseur modifié.",
        className: "border-green-500 bg-green-100 text-green-900",
      })
      // Update the suppliers list or refetch data here
      fetchSuppliers() //Refetch data after edit
    })
    .catch((error)=> {
      console.error("Erreur lors de la modification:", error.response?.data || error.message)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.response?.data?.message || "Une erreur s'est produite.",
      })
    });

  }

  const handleDelete = async (supplier) => {

    api.delete(`/api/suppliers/list/delete/${supplier._id}`)
    .then(response => {
       // Update local state immediately
       setSuppliersData(currentSuppliers => 
        currentSuppliers.filter(s => s._id !== supplier._id)
      )
      
      // Check if we need to adjust current page
      const newTotalItems = suppliersData.length - 1
      const newTotalPages = Math.max(1, Math.ceil(newTotalItems / itemsPerPage))
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages)
      }

      toast({
        title: "Succès",
        description: "Fournisseur supprimé.",
        className: "border-green-500 bg-green-100 text-green-900",
      })
    })
    .catch((error)=> {
      console.error("Erreur lors de la suppression:", error.response?.data || error.message)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.response?.data?.message || "Une erreur s'est produite.",
      })
      // Refresh the list in case of error to ensure consistency
      fetchSuppliers()
    });
  }

  return (
    <div className="px-8 pt-2 pb-2">
      <div className="flex justify-between items-center">
        <div className="flex gap-1">
          <Input className="h-8 bg-white" placeholder="Recherche" value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} />
        <Search/>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className=
          "bg-green-600 hover:bg-green-800">
              <span>
                <Plus />
              </span>
              Nouveau fournisseur
            </Button>
          </DialogTrigger>
          <DialogContent className="md:max-w-[600px] max-h-[550px] overflow-auto">
            <DialogHeader>
              <DialogTitle>Nouveau fournisseur</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4 py-4">
                {/* Nom */}
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Prénom */}
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Téléphone */}
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro de téléphone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Pays */}
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pays</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un pays" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="Maroc">Maroc</SelectItem>
                            <SelectItem value="Espagne">Espagne</SelectItem>
                            <SelectItem value="France">France</SelectItem>
                            <SelectItem value="Algerie">Algerie</SelectItem>
                            <SelectItem value="Corée">Corée</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Ville */}
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ville</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une ville" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="Marrakech">Marrakech</SelectItem>
                            <SelectItem value="Agadir">Agadir</SelectItem>
                            <SelectItem value="Casablanca">Casablanca</SelectItem>
                            <SelectItem value="Tanger">Tanger</SelectItem>
                            <SelectItem value="Rabat">Rabat</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Adresse */}
                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Catégorie */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catégorie</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="Nourriture">Nourriture</SelectItem>
                            <SelectItem value="Electroménager">Electroménager</SelectItem>
                            <SelectItem value="Immobilier">Immobilier</SelectItem>
                            <SelectItem value="Hygiène">Hygiène</SelectItem>
                            <SelectItem value="Equipement">Équipement</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Mode de paiement */}
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mode de paiement</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="Cash">Cash</SelectItem>
                            <SelectItem value="Virement">Virement</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* RIB */}
                <FormField
                  control={form.control}
                  name="rib"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rib</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
      <br />

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
                  <TableCell key={colIndex}>{item[col.key]}</TableCell>
                ))}
                <TableCell>
                  <div className="flex gap-2 justify-center items-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-yellow hover:bg-yellow-hover" size="sm" onClick={() => handleOpen(item)}>
                          Voir détails
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Détails</DialogTitle>
                        </DialogHeader>
                        {selectedItem && (
                          <form className="grid grid-cols-2 gap-4">
                            <div>
                              <Label> Nom</Label>
                              <Input value={item.lastName} disabled />
                            </div>
                            <div>
                              <Label> Prénom</Label>
                              <Input value={item.firstName} disabled />
                            </div>
                            <div>
                              <Label> Téléphone</Label>
                              <Input value={item.phoneNumber} disabled />
                            </div>
                            <div>
                              <Label> Email</Label>
                              <Input value={item.email} disabled />
                            </div>
                            <div>
                              <Label> Pays</Label>
                              <Input value={item.address.country} disabled />
                            </div>
                            <div>
                              <Label> Ville</Label>
                              <Input value={item.address.city} disabled />
                            </div>
                            <div>
                              <Label>Adresse</Label>
                              <Input value={item.address.street} disabled />
                            </div>
                            <div>
                              <Label> Catégorie</Label>
                              <Input value={item.category} disabled />
                            </div>
                            <div>
                              <Label> Méthode de paiement</Label>
                              <Input value={item.paymentMethod} disabled />
                            </div>
                            <div>
                              <Label>RIB</Label>
                              <Input value={item.rib} disabled />
                            </div>
                          </form>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className="bg-orange hover:bg-orange-hover"
                          size="sm"
                          onClick={() => {
                            setSelectedItem(item)
                            setEditFormData(item)
                          }}
                        >
                          Modifier
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Modifier Fournisseur</DialogTitle>
                        </DialogHeader>
                        {selectedItem && (
                          <form onSubmit={handleEditSubmit}>
                            <div className="grid grid-cols-2 gap-4 my-3">
                              <div>
                                <Label htmlFor="lastName">Nom</Label>
                                <Input
                                  id="lastName"
                                  name="lastName"
                                  value={editFormData.lastName || ""}
                                  onChange={handleEditInputChange}
                                />
                              </div>
                              <div>
                                <Label htmlFor="firstName">Prénom</Label>
                                <Input
                                  id="firstName"
                                  name="firstName"
                                  value={editFormData.firstName || ""}
                                  onChange={handleEditInputChange}
                                />
                              </div>
                              <div>
                                <Label htmlFor="phoneNumber">Téléphone</Label>
                                <Input
                                  id="phoneNumber"
                                  name="phoneNumber"
                                  value={editFormData.phoneNumber || ""}
                                  onChange={handleEditInputChange}
                                />
                              </div>
                              <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                  id="email"
                                  name="email"
                                  value={editFormData.email || ""}
                                  onChange={handleEditInputChange}
                                />
                              </div>
                              <div>
                                <Label htmlFor="country">Pays</Label>
                                <Input
                                  id="country"
                                  name="country"
                                  value={editFormData.address?.country || ""}
                                  onChange={handleEditInputChange}
                                />
                              </div>
                              <div>
                                <Label htmlFor="city">Ville</Label>
                                <Input
                                  id="city"
                                  name="city"
                                  value={editFormData.address?.city || ""}
                                  onChange={handleEditInputChange}
                                />
                              </div>
                              <div>
                                <Label htmlFor="street">Adresse</Label>
                                <Input
                                  id="street"
                                  name="street"
                                  value={editFormData.address?.street || ""}
                                  onChange={handleEditInputChange}
                                />
                              </div>
                              <div>
                                <Label htmlFor="category">Catégorie</Label>
                                <Input
                                  id="category"
                                  name="category"
                                  value={editFormData.category || ""}
                                  onChange={handleEditInputChange}
                                />
                              </div>
                              <div>
                                <Label htmlFor="paymentMethod">Méthode de paiement</Label>
                                <Input
                                  id="paymentMethod"
                                  name="paymentMethod"
                                  value={editFormData.paymentMethod || ""}
                                  onChange={handleEditInputChange}
                                />
                              </div>
                              <div>
                                <Label htmlFor="rib">RIB</Label>
                                <Input
                                  id="rib"
                                  name="rib"
                                  value={editFormData.rib || ""}
                                  onChange={handleEditInputChange}
                                />
                              </div>
                            </div>
                            <div className="flex justify-center items-center mt-6">
                              <Button type="submit" className="bg-orange hover:bg-orange-hover">
                                Enregistrer
                              </Button>
                            </div>
                          </form>
                        )}
                      </DialogContent>
                    </Dialog>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="bg-burgundy hover:bg-burgundy-hover" size="sm">
                          Supprimer
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Voulez vous vraiment supprimer ce fournisseur?</AlertDialogTitle>
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
  )
}

export default SuppliersList 

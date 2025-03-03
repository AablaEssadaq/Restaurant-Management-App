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
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Search } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import api from "@/config/api";
import { toast } from "@/hooks/use-toast";
import { Label } from "../ui/label";
import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";



const Managers = () => {

    const restaurant = useSelector((state) => state.auth.restaurant); 
    const owner = useSelector((state) => state.auth.user); 
    const [managers, setManagers] = useState([])
    const [selectedItem, setSelectedItem] = useState(null)
    const [editFormData, setEditFormData] = useState({})
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(5)
    const [searchQuery, setSearchQuery] = useState("")
    const [open, setOpen] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const columns = [
        { label: "Prénom", key: "firstName" },
        { label: "Nom", key: "lastName" },
        { label: "Téléphone", key: "phoneNumber" },
        { label: "Email", key: "email" },
    ];
    
    const formSchema = z.object({
      // Personal Information
      lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
      firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
      phoneNumber: z.string().min(8, "Le numéro de téléphone doit contenir au moins 8 chiffres"),
      // Credentials
      email: z.string().email("Veuillez entrer une adresse email valide"),
      password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
      confirmPassword: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères")
    }).refine((data) => data.password === data.confirmPassword, {
      message: "Les mots de passe ne correspondent pas",
      path: ["confirmPassword"],
    })

      const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          lastName: '',
          firstName: '',
          phoneNumber: '',
          email: '',
          password: '',
          confirmPassword: ''
        }
      })

  const handleOpen = (item) => {
      console.log(item)
      setSelectedItem(item)
  }

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    
    // Si le champ est country ou city, mettre à jour l'objet address imbriqué
    if (name === "country" || name === "city") {
      setEditFormData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          [name]: value
        }
      }));
    } else {
      // Pour les autres champs, mise à jour normale
      setEditFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

    
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    // Création de l'objet de données formaté
    const formattedData = {
      firstName: editFormData.firstName,
      lastName: editFormData.lastName,
      phoneNumber: editFormData.phoneNumber,
      email: editFormData.email,
      country: editFormData.address?.country,
      city: editFormData.address?.city
    };
    console.log(formattedData)
    await api.put(`/api/managers/update/${selectedItem._id}`, formattedData)
    .then((response) => {
    console.log(response.data)
    toast({
      title: "Succès",
      description: "Manager modifié avec succès.",
      className: "border-green-500 bg-green-100 text-green-900",
    });
    fetchManagers(); // Rafraîchir la liste
    })
    .catch((error)=> {
      console.error("Erreur lors de la modification:", error.response?.data || error.message)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.response?.data?.message || "Une erreur s'est produite.",
      })
      });
      
  };
    
   //Filter orders
   const filteredManagers = managers.filter((manager) => {
    const searchFields = [
      manager.firstName?.toString() || "",
      manager.lastName?.toString() || "",
      manager.email?.toString() || "",
      manager.phoneNumber?.toString() || "",
    ].map(field => field.toLowerCase()); // Now all fields are strings
  
    const query = searchQuery.toLowerCase();
    
    return searchFields.some(field => field.includes(query));
  });

    // Reset to first page when search query changes
    useEffect(() => {
      setCurrentPage(1)
    }, [searchQuery])

    // Calculate pagination with filtered results
    const totalItems = filteredManagers.length
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredManagers.slice(indexOfFirstItem, indexOfLastItem)
    
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


  // ✅ Handle form submission
  const onSubmit = async (data) => {
    console.log("Form submitted!"); // Debugging
 
    const formattedData = {
      ...data, 
      country: restaurant.address.country,
      city: restaurant.address.city,
      owner_id:owner._id,
      restaurant_id:restaurant._id,
    }

    console.log(formattedData)

    api.post('/api/managers/add',formattedData)
    .then(response => {
      console.log(response.data);
      toast({
        title: "Succès",
        description: "Manager ajouté.",
        className: "border-green-500 bg-green-100 text-green-900",
      })
      setOpen(false); // Close modal after submission
      form.reset()
      fetchManagers()
    })
    .catch((error)=> {
      console.error("Error adding the manager : ", error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `${error.message ||
        "Une erreur s'est produite."}`,
      })
      })
    
  }

  const handleDelete = async(item) => {
    api.delete(`/api/managers/delete/${item._id}`)
    .then(response => {
      console.log(response.data)
      toast({
        title: "Succès",
        description: "Manager supprimé.",
        className: "border-green-500 bg-green-100 text-green-900",
      })
      fetchManagers()
    })
    .catch((error)=> {
      console.error("Error deleting the manager : ", error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `${error ||
        "Une erreur s'est produite."}`,
      })
      });
    
  }

  const fetchManagers = useCallback(async () => {
    api.get(`/api/managers/${restaurant._id}`)
   .then((response) => {
    console.log(response.data.managers)
    setManagers(response.data.managers);
   })
    .catch((error)=>{
      console.error("Erreur de récupération des equipements:", error);
    })
    
  }, [restaurant._id]); // Dependencies for useCallback

  useEffect(() => {
    if (restaurant._id) {
      fetchManagers()
    }
  }, [restaurant._id, fetchManagers])

  return (
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
              Nouveau Manager
            </Button>
          </DialogTrigger>
          <DialogContent className="md:max-w-[600px] max-h-[550px] overflow-auto">
            <DialogHeader>
              <DialogTitle>Nouveau Manager</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4 py-4">
 
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
                  )}/>

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
                  )}/>

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
                  )}/>

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

                <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mot de passe</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                className="pr-10"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <i className="fa-regular fa-eye-slash fa-lg"></i> : <i className="fa-regular fa-eye fa-lg"></i>}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />   
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel> Confirmer le mot de passe</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                className="pr-10"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? <i className="fa-regular fa-eye-slash fa-lg"></i> : <i className="fa-regular fa-eye fa-lg"></i>}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                <div>{/* An empty div to fix the footer alignment*/} </div>
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
      { /*Managers Table */}
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
                  <Dialog>
                    <DialogTrigger asChild>
                       <Button className="bg-yellow hover:bg-yellow-hover" size="sm" onClick={() => handleOpen(item)}>
                          Voir détails
                       </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Détails du manager :</DialogTitle>
                      </DialogHeader>
                      {selectedItem && (
                        <>

                          <div className='flex justify-center items-center'>
                            <img className="rounded-full w-[100px] h-[100px]" src={item.user_id.avatar}/>
                          </div>
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
                                  <Label>Date de création du compte :</Label>
                                  <Input value={item.user_id?.created_at ? format(new Date(item.user_id.created_at), "dd MMMM yyyy", { locale: fr }) : ''} disabled />
                              </div>
                          </form>
                          </>
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
                            setEditFormData({
                              ...item,
                              address: {
                                country: item.address?.country || '',
                                city: item.address?.city || ''
                              }
                            });
                          }}
                        >
                          Modifier
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Modifier Manager</DialogTitle>
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
                          <AlertDialogTitle>Voulez vous vraiment le compte de ce manager ?</AlertDialogTitle>
                          <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-burgundy hover:bg-burgundy-hover" onClick={() => handleDelete(item)}
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

export default Managers
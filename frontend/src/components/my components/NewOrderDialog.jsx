import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2 } from 'lucide-react'
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from '@/hooks/use-toast'

const apiUrl = import.meta.env.VITE_URL_BASE

const NewOrderDialog = ({ uniqueSuppliers, fetchOrders }) => {

  const user = useSelector((state) => state.auth.user)
  const [open, setOpen] = useState(false)
  


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
  
    supplier_id: z.string().min(1, "Le fournisseur est requis"),
      
    
    products: z
      .array(
        z.object({
          product: z.string().min(1, "Le nom du produit est requis"),
          quantity: z.string().min(1).transform((val) => {
            const num = Number(val);
            return isNaN(num) ? 0 : num;
          }),
          price: z.string().min(1).transform((val) => {
            const num = Number(val);
            return isNaN(num) ? 0 : num;
          }),
        })
      )
      .min(1, "Au moins un produit est requis"),
  
   // total: z.number().min(0, "Le total ne peut pas être négatif"),
  });

  const form = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      orderDate: new Date().toISOString().split('T')[0],
      shippingDate: new Date().toISOString().split('T')[0],
      //status: "En cours",
      supplier_id:"",
      products: [{ product: '', quantity: '', price: '' }],
      //total: 0,

    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "products",
  })

  const onSubmit = async (data) => {
    try {
      // Find the selected supplier object
      /*const selectedSupplier = uniqueSuppliers.find(s => s._id === data.supplier_id)
      if (!selectedSupplier) {
        throw new Error("Supplier not found")
      }*/
      
      // Transform the data to match the schema
      const formattedData = {
        ...data,
       // supplier_id: selectedSupplier._id,
        owner_id:user._id,
        status: "En cours",
        products: data.products.map(product => ({
          ...product,
          quantity: Number(product.quantity),
          price: Number(product.price)
        })),
        /*total: data.products.reduce((sum, product) => {
          return sum + (Number(product.price) * Number(product.quantity))
        }, 0)*/
      }

      console.log(formattedData)
      const response = await axios.post(`${apiUrl}/api/suppliers/orders/add`,formattedData )
      console.log(response.data)
      toast({
        title: "Succès",
        description: "Commande ajoutée.",
        className: "border-green-500 bg-green-100 text-green-900",
      })
      setOpen(false)
      form.reset()
      fetchOrders()
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  const handleSupplierChange = (supplierId) => {
    const selectedSupplier = uniqueSuppliers.find(s => s._id === supplierId)
    form.setValue('supplier_id', selectedSupplier._id)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-800">
          <Plus className="mr-2" />
          Nouvelle commande
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouvelle Commande</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Supplier Select */}
            <FormField
              control={form.control}
              name="supplier_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fournisseur</FormLabel>
                  <Select 
                    onValueChange={handleSupplierChange}
                    value={field.value?._id}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un fournisseur" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {uniqueSuppliers.map((supplier) => (
                        <SelectItem 
                          key={supplier._id} 
                          value={supplier._id}
                        >
                          {`${supplier.lastName} ${supplier.firstName}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Rest of the form remains the same */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="orderDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de commande</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shippingDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de livraison</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <FormLabel>Produits</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ product: '', quantity: 1, price: 0 })}
                >
                  <Plus className="h-4 w-4" />
                  Ajouter un produit
                </Button>
              </div>
              
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-4 gap-4 items-end">
                  <FormField
                    control={form.control}
                    name={`products.${index}.product`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={index !== 0 ? "sr-only" : undefined}>
                          Nom du produit
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nom du produit" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
            control={form.control}
            name={`products.${index}.quantity`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className={index !== 0 ? "sr-only" : undefined}>
                  Quantité
                </FormLabel>
                <FormControl>
                  <Input 
                    {...field}
                    type="number" 
                    placeholder="Quantité"
                    min="1"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name={`products.${index}.price`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className={index !== 0 ? "sr-only" : undefined}>
                  Prix unitaire
                </FormLabel>
                <FormControl>
                  <Input 
                    {...field}
                    type="number" 
                    placeholder="Prix unitaire"
                    step="0.01"
                    min="0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> 
                  
                 
                  
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => fields.length > 1 && remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button type="submit" className="w-full bg-yellow hover:bg-yellow-hover">
              Créer la commande
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default NewOrderDialog
import { useState, useEffect } from 'react'
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
import api from '@/config/api'

const apiUrl = import.meta.env.VITE_URL_BASE

const OrderEditDialog = ({ uniqueSuppliers, order, fetchOrders }) => {
  const user = useSelector((state) => state.auth.user)
  const [open, setOpen] = useState(false)

  const orderSchema = z.object({
    orderDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "La date de commande est invalide",
    }),
    shippingDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "La date de livraison est invalide",
    }),
    status: z.enum(["En cours", "Livrée", "Annulée"], {
      message: "Statut invalide",
    }),
    supplier_id: z.string().min(1, "Le fournisseur est requis"),
    products: z
      .array(
        z.object({
          product: z.string().min(1, "Le nom du produit est requis"),
          quantity: z.number().min(1, "La quantité doit être au moins 1"),
          price: z.number().min(0, "Le prix ne peut pas être négatif"),
        })
      )
      .min(1, "Au moins un produit est requis"),
    total: z.number().min(0, "Le total ne peut pas être négatif"),
  });

  const form = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      orderDate: order?.orderDate?.split('T')[0] || new Date().toISOString().split('T')[0],
      shippingDate: order?.shippingDate?.split('T')[0] || new Date().toISOString().split('T')[0],
      status: order?.status || "En cours",
      supplier_id: order?.supplier?._id || "",
      products: order?.products || [{ product: '', quantity: 1, price: 0 }],
      total: order?.total || 0,
    },
  })

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        orderDate: order?.orderDate?.split('T')[0] || new Date().toISOString().split('T')[0],
        shippingDate: order?.shippingDate?.split('T')[0] || new Date().toISOString().split('T')[0],
        status: order?.status || "En cours",
        supplier_id: order?.supplier?._id || "",
        products: order?.products || [{ product: '', quantity: 1, price: 0 }],
        total: order?.total || 0,
      })
    }
  }, [open, order, form])

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "products",
  })

  const onSubmit = async (data) => {
      api.put(`/api/suppliers/orders/update/${order._id}`, {
        ...data,
        owner_id: user._id
      })
      .then(response => {
        if (response.status === 200) {
          toast({
            title: "Commande modifiée",
            description: "La commande a été modifiée avec succès",
            className: "border-green-500 bg-green-100 text-green-900",
          })
          fetchOrders();
          setOpen(false)
        }
      })
      .catch((error)=> {
        console.error("Error submitting form:", error)
        toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification de la commande",
        variant: "destructive",
      })
      });
  }

  const handleSupplierChange = (supplierId) => {
    form.setValue('supplier_id', supplierId)
  }

  // Calculate total when products change
  const calculateTotal = () => {
    const products = form.getValues('products')
    const total = products.reduce((sum, product) => {
      return sum + (product.quantity * product.price)
    }, 0)
    form.setValue('total', total)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-orange hover:bg-orange-hover" size="sm">
          Modifier
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier la commande</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="supplier_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fournisseur</FormLabel>
                  <Select 
                    onValueChange={handleSupplierChange}
                    value={field.value}
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="En cours">En cours</SelectItem>
                        <SelectItem value="Livrée">Livrée</SelectItem>
                        <SelectItem value="Annulée">Annulée</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="total"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        readOnly
                        step="0.01"
                        min="0"
                      />
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
                            onChange={(e) => {
                              field.onChange(Number(e.target.value))
                              calculateTotal()
                            }}
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
                            onChange={(e) => {
                              field.onChange(Number(e.target.value))
                              calculateTotal()
                            }}
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
              Enregistrer
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default OrderEditDialog